import axios from "axios"

const GlobalApis = {
  GetAllGrades: async () => {
    return axios.get('/api/grade')
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching grades:", error);
        throw error;
      });
  },

  createNewStudent:async (data) =>{
    return axios.post("/api/student",data).then(response=>response.data).catch(error => {
        console.error("Error fetching grades:", error);
        throw error;
      });
  },

  GetAllStudent :async () => {
    return axios.get('/api/student')
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching grades:", error);
        throw error;
      });
  },

  DeleteStudent: async (id) => {
    return axios.delete('/api/student', {
      data: { id }
    })
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching grades:", error);
      throw error;
    });
  },

  GetAllAttendanceList :async (grade, month) => {
    if (!grade) {
      console.error("Grade is not provided");
      return;
    }
  
    return axios.get(`/api/attendance?grade=${grade}&month=${month}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching grades:", error);
        throw error;
      });  
  },

  MarkAttendance: async (data) => {
    return axios.post('/api/attendance', data)
      .then(response => response.data)
      .catch(error => {
        console.error("Error fetching grades:", error);
        throw error;
      });
  },

  MarkAttendanceDelete: async ({ student_id, day, date }) => {
    return axios.delete(`/api/attendance?student_id=${student_id}&day=${day}&date=${date}`)
      .then(response => response.data)
      .catch(error => {
        console.error("Error deleting attendance:", error);
        throw error;
      });
  },



};



export default GlobalApis 