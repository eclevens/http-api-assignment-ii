// helper function to display output on the webpage
const displayMessage = (message) => {
  const content = document.getElementById('content'); //get content section
  content.innerHTML = `<pre>${message}</pre>`; // display message, keep formatting
};

// Add User form
document.getElementById('nameForm').addEventListener('submit', (e) => {
  e.preventDefault(); //stop page reload

  const name = document.getElementById('nameField').value; //name
  const age = document.getElementById('ageField').value; //age

  //send POST request
  fetch('/addUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `name=${encodeURIComponent(name)}&age=${encodeURIComponent(age)}`
  })
  .then(response => {
    console.log('Status:', response.status); // 201 204 400

    if (response.status === 201) {
      // new user added
      return response.json().then(data => {
        console.log('Message:', data.message);
        displayMessage(`Status: ${response.status}\nMessage: ${data.message}`);
      });
    } else if (response.status === 204) {
      // existing user updated
      console.log('User updated successfully (no content)');
      displayMessage(`Status: ${response.status}\nUser updated successfully`);
    } else if (response.status === 400) {
      // missing name or age
      return response.json().then(data => {
        console.log('Error:', data.message);
        displayMessage(`Status: ${response.status}\nError: ${data.message}`);
      });
    }
  })
  .catch(error => {
    console.error('Fetch error:', error);
    displayMessage(`Fetch error: ${error}`);
  });
});

// Get User form
document.getElementById('userForm').addEventListener('submit', (e) => {
  e.preventDefault(); //stop page reload

  const url = document.getElementById('urlField').value; //selected URL
  const method = document.getElementById('methodSelect').value.toUpperCase(); //selected method

  //send GET or HEAD request
  fetch(url, { method })
    .then(response => {
      console.log('Status:', response.status); // log status

      if (method === 'HEAD') {
        //HEAD request → no body, just status
        console.log('HEAD request, no content to parse.');
        displayMessage(`HEAD request\nStatus: ${response.status}`);
      } else {
        //GET request → parse JSON
        return response.json().then(data => {
          console.log('Data:', data);
          displayMessage(`Status: ${response.status}\nData:\n${JSON.stringify(data, null, 2)}`);
        });
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      displayMessage(`Fetch error: ${err}`);
    });
});