const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const User = require("../models/user");

document.querySelector('.info-table').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    // ... rest of the data ...
  
    fetch('/update_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        email: email,
        // ... rest of the data ...
      }),
    })
    .then(response => response.json()) // Parse the JSON from the response
    .then(data => {
      if (data.success) {
        // Handle successful update
        console.log('User updated successfully:', data.user);
        // You can update the UI here
      } else {
        // Handle error from server
        console.error('Error updating user:', data.error);
        // You can show an error message in the UI here
      }
    })
    .catch(error => {
      // Handle network error
      console.error('Network error:', error);
      // You can show a network error message in the UI here
    });
module.exports = router;