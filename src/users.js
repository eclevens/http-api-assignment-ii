const users = {};

// add a new user or update existing user
const addUser = (name, age) => {
  if (!name || !age) {
    // missing required fields
    return { status: 400, message: 'Name and/or age missing', id: 'missingParams' };
  }

  if (users[name]) {
    // update existing user
    users[name].age = age;
    return { status: 204 };
  }

  // add new user
  users[name] = { name, age };
  return { status: 201, message: 'User added' };
};

module.exports = { users, addUser };
