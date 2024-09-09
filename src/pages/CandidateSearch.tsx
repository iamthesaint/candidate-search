import { useEffect, useState } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch random gh users
  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true);
      const randomCandidates = await searchGithub();
      
      // fetch full details for each user
      const detailedCandidates = await Promise.all(
        randomCandidates.map(async (candidate: Candidate) => {
          const details = await searchGithubUser(candidate.login);
          return { ...candidate, ...details };
        })
      );

      setCandidates(detailedCandidates);
      setLoading(false);
    };

    fetchCandidates();
  }, []);

  // go to the next candidate (skip)
  const handleSkipCandidate = () => {
    setCandidates(candidates.slice(1));
  };

  // save candidate to potentials
  const handleSaveCandidate = (candidate: Candidate) => {
    try {
      const savedCandidates = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      savedCandidates.push(candidate);
      localStorage.setItem('savedCandidates', JSON.stringify(savedCandidates));
      console.log('Candidate saved:', candidate);
    } catch (err) {
      console.error('Error saving candidate:', err);
    }
    handleSkipCandidate();
  };

  if (loading) {
    return <p>Loading candidates...</p>;
  }

  return (
    <div>
      <h1>Candidate Search</h1>
      {candidates.length > 0 ? (
        <>
          <div className="candidate-card">
            <img src={candidates[0].avatar_url} alt={candidates[0].login} />
            <h2>{candidates[0].name || candidates[0].login}</h2>
            <p>{candidates[0].location || 'Location not available'}</p>
            <p>{candidates[0].email || 'Email not available'}</p>
            <p>{candidates[0].company || 'Company not available'}</p>
            <p>{candidates[0].bio || 'Bio not available'}</p>

            <div className="buttons">
              <button onClick={() => handleSaveCandidate(candidates[0])} style={{ backgroundColor: 'green', color: 'white' }}>
                Save +
              </button>
              <button onClick={handleSkipCandidate} style={{ backgroundColor: 'red', color: 'white' }}>
                Skip -
              </button>
            </div>
          </div>
        </>
      ) : (
        <p>No more candidates available</p>
      )}
    </div>
  );
};

export default CandidateSearch;
