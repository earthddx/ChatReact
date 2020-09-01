const users = [];

//helper functions

const addUser = ({ id, name, channel }) => {
  name = name.trim().toLowerCase();
  channel = channel.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.channel === channel && user.name === name
  );
  if (!name || !channel) return { error: "Username and channel are required." };
  if (existingUser) {
    return {
      error: "Username is taken.",
    };
  }
  const user = { id, name, channel };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInChannel = (channel) =>
  users.filter((user) => user.channel === channel);

module.exports = { addUser, removeUser, getUser, getUsersInChannel };
