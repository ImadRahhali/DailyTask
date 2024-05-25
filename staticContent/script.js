const apiGateway = "https://nwqg5tgzz1.execute-api.us-east-1.amazonaws.com/prod";

async function addTodo() {
  const inputElement = document.getElementById('new-todo');
  const todoName = inputElement.value.trim();

  if (!todoName) {
    alert('Please enter a valid Task item.');
    return;
  }

  const apiUrl = `${apiGateway}/addtodo`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: todoName })
    });

    const data = await response.json();
    alert(data.message);
    inputElement.value = '';
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function getTodo() {
  const idElement = document.getElementById('todo-id');
  const todoId = idElement.value.trim();

  if (!todoId) {
    alert('Please enter a valid Task ID.');
    return;
  }

  const apiUrl = `${apiGateway}/gettodo?id=${todoId}`;
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      displayTodo(data);
    } else {
      console.error('Error:', data.error);
    }

    idElement.value = ''; 
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}
function toggleDisplayItem() {
  var x = document.getElementById("gotten-item");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

function displayTodo(data) {
  toggleDisplayItem();
  const todoId = data.id.N;
  const todoName = data.name.S;
  const todoDescription = data.description.S; 
  const todoStatus = data.status.S; 

  document.getElementById('todo-id-display').textContent = todoId;
  document.getElementById('todo-name-display').textContent = todoName;
  document.getElementById('todo-description-display').textContent = todoDescription;
  document.getElementById('todo-status-display').textContent = todoStatus;

  createUpdateButtons(todoId, todoName, todoDescription, todoStatus);
}

function createUpdateButtons(todoId, todoName, todoDescription, todoStatus) {
  removeUpdateButtons();

  createButton('Update Name', 'update-name-button', () => {
    const newName = prompt('Enter new name:');
    if (newName) {
      updateName(todoId, newName, todoDescription);
    }
  }, 'update-name-button-container');

  createButton('Update Description', 'update-description-button', () => {
    const newDesc = prompt('Enter new description:');
    if (newDesc) {
      updateDescription(todoId, newDesc, todoName);
    }
  }, 'update-description-button-container');

  createButton('Mark as Completed', 'update-status-button', () => {
    updateStatus(todoId);
  }, 'update-status-button-container');

  function createButton(text, id, onClick, containerId) {
    const button = document.createElement('button');
    button.textContent = text;
    button.id = id;
    button.className = 'update-button';
    button.onclick = onClick;
    document.getElementById(containerId).appendChild(button);
  }
}

function removeUpdateButtons() {
  document.querySelectorAll('.update-button').forEach(button => button.remove());
}
function toggleDisplayTable() {
  var x = document.getElementById("table");
  if (x.style.display === "none") {
    x.style.display = "block";
    showHideButton.textContent = 'Refresh List';
  } 
}
function hideDisplayTable() {
  var x = document.getElementById("table");
  if (x.style.display === "block") {
    x.style.display = "none";
    showHideButton.textContent = 'Show All Tasks';
  } 
}

let showHideButton = document.getElementById('showHideButton');

async function showAllTodos() {
  const todoListElement = document.getElementById('todo-list');

  try {
      const response = await fetch(`${apiGateway}/getall`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const data = await response.json();

      if (response.ok) {
        toggleDisplayTable()
          todoListElement.innerHTML = '';

          data.forEach(todo => {
              const tr = document.createElement('tr');
              tr.appendChild(createTd(todo.id.N));
              tr.appendChild(createTd(todo.name.S));
              tr.appendChild(createTd(todo.description.S));
              tr.appendChild(createTd(todo.status.S));
              tr.appendChild(createActionsTd(todo.id.N));
              todoListElement.appendChild(tr);
          });
      } else {
          console.error('Error:', data.error);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
  }

  function createTd(text) {
      const td = document.createElement('td');
      td.textContent = text;
      return td;
  }

  function createActionsTd(id) {
      const td = document.createElement('td');
      td.appendChild(createButton('Mark as Completed', 'complete', async () => {
          await updateStatusOnList(id);
          showAllTodos();
      }));
      td.appendChild(createButton('Delete', 'delete', async () => {
          await deleteTodo(id);
          showAllTodos();
      }));
      return td;
  }

  function createButton(text, className, onClick) {
      const button = document.createElement('button');
      button.textContent = text;
      button.className = `action-button ${className}`;
      button.onclick = onClick;
      return button;
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`${apiGateway}/deletetodo?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function updateName(id, newName, description) {
  try {
    const response = await fetch(`${apiGateway}/updatetodo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName, description: description })
    });

    if (response.ok) {
      document.getElementById('todo-name-display').textContent = newName;
      createUpdateButtons(id, newName, description);
    } else {
      alert('Update failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function updateDescription(id, newDescription, name) {
  try {
    const response = await fetch(`${apiGateway}/updatetodo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: name, description: newDescription })
    });

    if (response.ok) {
      document.getElementById('todo-description-display').textContent = newDescription;
      createUpdateButtons(id, name, newDescription);
    } else {
      alert('Update failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}

async function updateStatus(id) {
  try {
    const response = await fetch(`${apiGateway}/completetodo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      document.getElementById('todo-status-display').textContent = 'COMPLETED';
    } else {
      alert('Update failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}
async function updateStatusOnList(id) {
  try {
    const response = await fetch(`${apiGateway}/completetodo?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const todoStatusDisplay = document.getElementById('todo-status-display');
      if (todoStatusDisplay) {
        todoStatusDisplay.textContent = 'COMPLETED';
      }
      showAllTodos();
    } else {
      alert('Update failed. Please try again.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
}



function hideAllTodos() {
  hideDisplayTable()
  const todoListElement = document.getElementById('todo-list');
  todoListElement.innerHTML = ''; 
}
