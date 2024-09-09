import { useState, useEffect } from 'react';
import { searchGithubUser } from '../api/API';
import Candidate from '../interfaces/Candidate.interface';

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the saved candidates from the API
    const fetchSavedCandidates = async () => {
      const savedCandidateData = JSON.parse(localStorage.getItem('savedCandidates') || '[]');
      const updatedCandidates: Candidate[] = [];
      setLoading(true);

      try {
        for (const savedCandidate of savedCandidateData) {
          const updatedCandidate = await searchGithubUser(savedCandidate.login);
          if (updatedCandidate && updatedCandidate.login) {
            updatedCandidates.push(updatedCandidate);
          }
        }
        setSavedCandidates(updatedCandidates);
      } catch (error) {
        setError('Error fetching saved candidates');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCandidates();

  }, []);

  // fx to remove a candidate from the saved list
  const removeSavedCandidate = (login: string) => {
    const updatedCandidates = savedCandidates.filter((candidate) => candidate.login !== login);
    setSavedCandidates(updatedCandidates);
    localStorage.setItem('savedCandidates', JSON.stringify(updatedCandidates));
  };

  return (
    <div>
      <h1>Potential Candidates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : savedCandidates.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name/Username</th>
              <th>Location</th>
              <th>Email</th>
              <th>Company</th>
              <th>Bio</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.login}>
                <td>
                  <img src={candidate.avatar_url} alt={candidate.login} style={{ width: '50px', borderRadius: '50%' }} />
                </td>
                <td>
                  <a href={candidate.html_url} target="_blank" rel="noreferrer">
                    {candidate.name || candidate.login}
                  </a>
                </td>
                <td>{candidate.location || 'Location not available'}</td>
                <td>{candidate.email || 'Email not available'}</td>
                <td>{candidate.company || 'Company not available'}</td>
                <td>{candidate.bio || 'Bio not available'}</td>
                <td>
                  {/* reject button */}
                  <button onClick={() => removeSavedCandidate(candidate.login)} style={{ backgroundColor: 'red', color: 'white' }}>
                    - Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No saved candidates...</p>
      )}
    </div>
  );
}

export default SavedCandidates;
