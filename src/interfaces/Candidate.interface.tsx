// TODO: Create an interface for the Candidate objects returned by the API

interface Candidate {
  avatar_url: string; // image url
  name?: string; // name
  login: string; // username
  location?: string; // location
  email?: string; // email
  html_url: string; // github profile url
  company?: string; // company
  bio?: string; // bio
}


export default Candidate;