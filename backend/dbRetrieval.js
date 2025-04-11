const queryDatabase = require('database'); // Make sure this is the correct path to your queryDatabase module

const retrieveBoards = async (userID) => {
    const query = "SELECT B.* FROM boards B JOIN credentials C ON B.created_by = C.id WHERE B.created_by = $1";
    try {
        const boards = await queryDatabase(query, [userID]);
        return boards; // Return the boards data
    } catch (error) {
        console.error("Error retrieving boards:", error);
        throw error; // Throw the error so it can be handled later
    }
};

module.exports = retrieveBoards;