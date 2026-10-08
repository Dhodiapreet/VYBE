const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const ApiError = require('../../utils/ApiError');
const tmdbService = require('../movies/tmdb.service');

const imageUrl = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

const mapCredit = (credit) => {
  const isSeries = credit.media_type === 'tv';
  const title = isSeries ? (credit.name || credit.original_name) : (credit.title || credit.original_title);
  const date = isSeries ? credit.first_air_date : credit.release_date;

  return {
    tmdbId: credit.id,
    mediaType: isSeries ? 'Series' : 'Movie',
    title: title || 'Untitled',
    originalTitle: isSeries ? (credit.original_name || title) : (credit.original_title || title),
    character: credit.character || null,
    job: credit.job || null,
    releaseDate: date || null,
    posterUrl: imageUrl(credit.poster_path),
    backdropUrl: imageUrl(credit.backdrop_path, 'w780'),
    averageRating: credit.vote_average ? Number((credit.vote_average / 2).toFixed(1)) : 0,
    voteCount: credit.vote_count || 0,
    popularity: credit.popularity || 0
  };
};

exports.searchPeople = asyncHandler(async (req, res) => {
  const query = String(req.query.query || '').trim();
  const page = Math.max(1, Number(req.query.page) || 1);

  if (query.length < 2) {
    return res.status(200).json(new ApiResponse(200, {
      page: 1,
      totalPages: 0,
      totalResults: 0,
      results: []
    }, 'Enter at least 2 characters to search people'));
  }

  const data = await tmdbService.searchPeople(query, page);
  const results = (data.results || [])
    .filter(person => person.id && person.name)
    .map(person => ({
      ...mapSearchPerson(person),
      category: classifyPerson(person)
    }));

  res.status(200).json(new ApiResponse(200, {
    page: data.page || page,
    totalPages: data.total_pages || 0,
    totalResults: data.total_results || results.length,
    results
  }, 'TMDB people search results'));
});

const mapSearchPerson = (person) => ({
  tmdbId: person.id,
  name: person.name,
  gender: person.gender || 0,
  knownForDepartment: person.known_for_department || null,
  popularity: person.popularity || 0,
  profileUrl: imageUrl(person.profile_path, 'w500'),
  knownFor: (person.known_for || []).slice(0, 3).map(item => ({
    tmdbId: item.id,
    mediaType: item.media_type === 'tv' ? 'Series' : 'Movie',
    title: item.name || item.title || 'Untitled',
    posterUrl: imageUrl(item.poster_path)
  }))
});

const classifyPerson = (person) => {
  if (person.known_for_department === 'Directing') return 'Director';
  if (person.known_for_department === 'Sound') return 'Musician';
  if (person.known_for_department === 'Acting' && person.gender === 2) return 'Hero';
  if (person.known_for_department === 'Acting' && person.gender === 1) return 'Heroine';
  return 'Other';
};

const FAMOUS_PEOPLE_SEEDS = [
  'Tom Holland',
  'Zendaya',
  'Robert Downey Jr.',
  'Chris Hemsworth',
  'Scarlett Johansson',
  'Ryan Reynolds',
  'Dwayne Johnson',
  'Tom Cruise',
  'Leonardo DiCaprio',
  'Brad Pitt',
  'Margot Robbie',
  'Anne Hathaway',
  'Keanu Reeves',
  'Emma Stone',
  'Jason Statham',
  'Shah Rukh Khan',
  'Salman Khan',
  'Aamir Khan',
  'Amitabh Bachchan',
  'Deepika Padukone',
  'Alia Bhatt',
  'Priyanka Chopra Jonas',
  'Christopher Nolan',
  'S. S. Rajamouli'
];

const CATEGORY_SEEDS = {
  Hero: [
    'Tom Holland', 'Robert Downey Jr.', 'Chris Hemsworth', 'Ryan Reynolds',
    'Dwayne Johnson', 'Tom Cruise', 'Leonardo DiCaprio', 'Brad Pitt',
    'Keanu Reeves', 'Jason Statham', 'Shah Rukh Khan', 'Salman Khan',
    'Aamir Khan', 'Amitabh Bachchan', 'Ranbir Kapoor', 'Ranveer Singh'
  ],
  Heroine: [
    'Zendaya', 'Scarlett Johansson', 'Margot Robbie', 'Anne Hathaway',
    'Emma Stone', 'Deepika Padukone', 'Alia Bhatt', 'Priyanka Chopra Jonas',
    'Katrina Kaif', 'Gal Gadot', 'Natalie Portman', 'Jennifer Lawrence'
  ],
  Director: [
    'Christopher Nolan', 'Steven Spielberg', 'James Cameron', 'Quentin Tarantino',
    'S. S. Rajamouli', 'Rajkumar Hirani', 'Sanjay Leela Bhansali',
    'Zoya Akhtar', 'Greta Gerwig', 'Denis Villeneuve', 'David Fincher', 'Martin Scorsese'
  ],
  Musician: [
    'Anirudh Ravichander', 'A.R. Rahman', 'Pritam Chakraborty', 'Arijit Singh',
    'Shreya Ghoshal', 'Amit Trivedi', 'Vishal Dadlani', 'Harris Jayaraj',
    'Yuvan Shankar Raja', 'Hans Zimmer', 'Ramin Djawadi', 'Ludwig Göransson'
  ],
  Other: [
    'Kevin Feige', 'Jerry Bruckheimer', 'Vince Gilligan', 'Aaron Sorkin',
    'Akiva Goldsman', 'David S. Goyer', 'Christopher Markus', 'Stephen McFeely',
    'Greg Berlanti', 'Stan Lee', 'Paul Thomas Anderson', 'Sacha Baron Cohen'
  ]
};

const searchSeedPeople = async (names) => {
  const responses = await Promise.all(
    names.map(name => tmdbService.searchPeople(name, 1).catch(() => ({ results: [] })))
  );
  const unique = new Map();
  responses.forEach((response, index) => {
    const exact = (response.results || []).find(
      person => person.name.toLowerCase() === names[index].toLowerCase()
    );
    const person = exact || response.results?.[0];
    if (person?.id && person?.name) unique.set(person.id, person);
  });
  return [...unique.values()];
};

exports.discoverPeople = asyncHandler(async (req, res) => {
  const category = String(req.query.category || 'All').trim();
  const page = Math.max(1, Number(req.query.page) || 1);

  let people;

  if (category === 'All' || CATEGORY_SEEDS[category]) {
    const seeds = category === 'All' ? FAMOUS_PEOPLE_SEEDS : CATEGORY_SEEDS[category];
    people = await searchSeedPeople(seeds);
  } else {
    const data = await tmdbService.getPopularPeople(page);
    people = data.results || [];
  }

  let results = people
    .filter(person => person?.profile_path)
    .filter(person => category === 'All' || classifyPerson(person) === category)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 24)
    .map(person => ({
      ...mapSearchPerson(person),
      category: classifyPerson(person)
    }));

  if (category === 'All' && results.length < 24) {
    const fallback = await tmdbService.getTrendingPeople(1);
    const existing = new Set(results.map(person => person.tmdbId));
    results = results
      .concat(
        (fallback.results || [])
          .filter(person => person?.profile_path && !existing.has(person.id))
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 24 - results.length)
          .map(person => ({
            ...mapSearchPerson(person),
            category: classifyPerson(person)
          }))
      );
  }

  res.status(200).json(new ApiResponse(200, {
    page,
    totalResults: results.length,
    category,
    results
  }, 'TMDB people directory fetched'));
});

exports.getByTmdbId = asyncHandler(async (req, res) => {
  const tmdbId = Number(req.params.id);
  if (!Number.isInteger(tmdbId) || tmdbId <= 0) {
    throw new ApiError(400, 'Invalid TMDB person ID');
  }

  const person = await tmdbService.getPersonDetails(tmdbId);
  const combined = person.combined_credits || {};
  const rawCredits = [...(combined.cast || []), ...(combined.crew || [])];

  const credits = rawCredits
    .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
    .map(mapCredit)
    .filter(item => item.title);

  const unique = new Map();
  for (const credit of credits) {
    const key = `${credit.mediaType}:${credit.tmdbId}`;
    const existing = unique.get(key);
    if (!existing) unique.set(key, credit);
    else {
      existing.character = existing.character || credit.character;
      existing.job = existing.job || credit.job;
    }
  }

  const allCredits = [...unique.values()].sort((a, b) => {
    const da = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
    const db = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
    return db - da || (b.popularity || 0) - (a.popularity || 0);
  });

  res.status(200).json(new ApiResponse(200, {
    tmdbId: person.id,
    name: person.name,
    biography: person.biography || '',
    birthday: person.birthday || null,
    deathday: person.deathday || null,
    placeOfBirth: person.place_of_birth || null,
    knownForDepartment: person.known_for_department || null,
    popularity: person.popularity || 0,
    profileUrl: imageUrl(person.profile_path, 'w500'),
    homepage: person.homepage || null,
    imdbId: person.external_ids?.imdb_id || null,
    totalCredits: allCredits.length,
    movies: allCredits.filter(item => item.mediaType === 'Movie'),
    series: allCredits.filter(item => item.mediaType === 'Series')
  }, 'TMDB person details fetched'));
});