import { useEffect, useState } from "react";
import { searchGithub, searchGithubUser } from "../api/API";
import Candidate from "../interfaces/Candidate.interface";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";

const CandidateSearch = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  // fetch random GitHub users
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

  // Skip candidate
  const handleSkipCandidate = () => {
    setCandidates(candidates.slice(1));
  };

  // Save candidate to potentials
  const handleSaveCandidate = (candidate: Candidate) => {
    try {
      const savedCandidates = JSON.parse(
        localStorage.getItem("savedCandidates") || "[]"
      );
      savedCandidates.push(candidate);
      localStorage.setItem("savedCandidates", JSON.stringify(savedCandidates));
      console.log("Candidate saved:", candidate);
    } catch (err) {
      console.error("Error saving candidate:", err);
    }
    handleSkipCandidate();
  };

  if (loading) {
    return <h2>Loading candidates...</h2>;
  }

  return (
    <div className="candidate-search-container">
      <h1>Candidate Search</h1>
      {candidates.length > 0 ? (
        <div className="candidate-card">
          <div className="avatar-container">
            <img
              src={candidates[0].avatar_url}
              alt={candidates[0].login}
              className="candidate-avatar"
            />
          </div>
          <div className="card-content">
            <h2>{candidates[0].name || candidates[0].login}</h2>
            <p>
              <strong>Username:</strong> {candidates[0].login}
            </p>
            <p>
              <strong>Location:</strong>{" "}
              {candidates[0].location || "Location not provided"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {candidates[0].email || "Email not provided"}
            </p>
            <p>
              <strong>Company:</strong>{" "}
              {candidates[0].company || "Company not provided"}
            </p>
            <p>
              <strong>Bio:</strong> {candidates[0].bio || "Bio not provided"}
            </p>
            <br />
          </div>
          <div className="card-buttons">
            <button
              onClick={() => handleSaveCandidate(candidates[0])}
              className="plus"
            >
              <FaCirclePlus />
            </button>
            <button onClick={handleSkipCandidate} className="minus">
              <FaCircleMinus />
            </button>
          </div>
        </div>
      ) : (
        <h3 className="end-msg" style={{ textAlign: "center" }}>You've reached the end!
          <br />
          To view more candidates, please refresh the page.
        </h3>
      )}
    </div>
  );
};

export default CandidateSearch;
