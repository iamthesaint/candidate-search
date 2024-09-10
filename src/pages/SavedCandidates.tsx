import { useState, useEffect } from "react";
import { searchGithubUser } from "../api/API";
import Candidate from "../interfaces/Candidate.interface";
import { FaRegTrashAlt, FaSortAlphaUp, FaSortAlphaDown } from "react-icons/fa";

const SavedCandidates = () => {
  const [savedCandidates, setSavedCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    // Fetch the saved candidates from the API
    const fetchSavedCandidates = async () => {
      const savedCandidateData = JSON.parse(
        localStorage.getItem("savedCandidates") || "[]"
      );
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
        setError("Error fetching saved candidates");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedCandidates();
  }, []);

  // fx to remove a candidate from the saved list
  const removeSavedCandidate = (login: string) => {
    const updatedCandidates = savedCandidates.filter(
      (candidate) => candidate.login !== login
    );
    setSavedCandidates(updatedCandidates);
    localStorage.setItem("savedCandidates", JSON.stringify(updatedCandidates));
  };

  // fx to sort the saved candidates
  const sortSavedCandidates = (criteria: string) => {
    const direction = sortCriteria === criteria && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortCriteria(criteria);
    setSortDirection(direction);

    const sortedCandidates = [...savedCandidates].sort((a, b) => {
      let valueA = '';
      let valueB = '';
  
      if (criteria === 'name') {
        valueA = (a.name || a.login || '').toLowerCase();
        valueB = (b.name || b.login || '').toLowerCase();
      } else {
        valueA = (a[criteria] || '').toString().toLowerCase();
        valueB = (b[criteria] || '').toString().toLowerCase();
      }
  
      if (valueA < valueB) return direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSavedCandidates(sortedCandidates);
  };

  // fx to render the sort icon so the user knows it's an option
  const renderSortIcon = (criteria: string) => {
    if (sortCriteria === criteria) {
      return sortDirection === 'asc' ? <FaSortAlphaUp /> : <FaSortAlphaDown />;
    }
    return null;
  };

  return (
    <div>
      <h1>Potential Candidates</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : savedCandidates.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th className="sortable" onClick={() => sortSavedCandidates('name')}>Name/Login {renderSortIcon('name')}</th>
              <th className="sortable" onClick={() => sortSavedCandidates('location')}>Location {renderSortIcon('location')}</th>
              <th>Email</th>
              <th className="sortable" onClick={() => sortSavedCandidates('company')}>Company {renderSortIcon('company')}</th>
              <th>Bio</th>
              <th>Reject</th>
            </tr>
          </thead>
          <tbody>
            {savedCandidates.map((candidate) => (
              <tr key={candidate.login}>
                <td>
                  <img
                    className="table-avatar"
                    src={candidate.avatar_url}
                    alt={candidate.login}
                    style={{ width: "100px", height: "100px", border: "1px solid #ccc" }}
                  />
                </td>
                <td>
                  <a href={candidate.html_url} target="_blank" rel="noreferrer">
                    {candidate.name || candidate.login}
                  </a>
                </td>
                <td>{candidate.location || "Location not provided"}</td>
                <td>{candidate.email || "Email not provided"}</td>
                <td>{candidate.company || "Company not provided"}</td>
                <td>{candidate.bio || "Bio not provided"}</td>
                <td>
                  <button
                    onClick={() => removeSavedCandidate(candidate.login)}
                    className="remove-button"
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No saved candidates yet...</h3>
      )}
    </div>
  );
};

export default SavedCandidates;
