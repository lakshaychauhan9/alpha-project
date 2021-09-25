import axios from "axios";

const instance = axios.create({
  baseURL: "https://project-alphabe.herokuapp.com",
});

export default instance;
