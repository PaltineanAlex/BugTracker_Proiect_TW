const { Users, Bugs, Projects, sequelize } = require('./bazadate');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

// Method to get a specific bug by ID
async function getBug(request, response) {
  try {
    const bugId = request.params.id;
    const bug = await Bugs.findByPk(bugId);
    
    if (bug) {
      response.status(200).json(bug);
    } else {
      response.status(404).json({ error: 'Bug not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

async function getProject(request, response) {

  try {
    const projectId = request.params.id;

    // Găsește proiectul specificat de ID
    const project = await Projects.findByPk(projectId);

    if (!project) {
      return response.status(404).json({ error: 'Proiectul nu a fost găsit.' });
    }

    // Returnează informațiile despre proiect
    response.status(200).json(project);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Eroare la obținerea informațiilor despre proiect.' });
  }
}

// Method to get all bugs
async function getBugs(request, response) {
  try {
    const bugs = await Bugs.findAll();
    response.status(200).json(bugs);
  } catch (error) {
    response.status(500).json({ error });
  }
}

async function getBugsByProjectId(request, response) {
  try {
    const projectId = request.params.projectId;

    // Găsește proiectul pentru care vrei să obții bug-urile
    const project = await Projects.findByPk(projectId);

    if (!project) {
      return response.status(404).json({ error: 'Proiectul nu a fost găsit.' });
    }

    // Găsește toate bug-urile asociate proiectului
    const bugs = await Bugs.findAll({
      where: { projectId: projectId },
    });

    response.status(200).json(bugs);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Eroare la obținerea bug-urilor.' });
  }
}

// Method to get a specific user by ID
async function getUser(request, response) {
  try {
    const userId = request.params.id;
    const user = await Users.findByPk(userId);
    
    if (user) {
      response.status(200).json(user);
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to get all users
async function getUsers(request, response) {
  try {
    const users = await Users.findAll();
    response.status(200).json(users);
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to get projects by user ID
async function getProjectsByUserId(request, response) {
  try {
    const userId = request.params.id;
    const projects = await Projects.findAll({
      where: {
        userId: userId,
      },
    });
    
    response.status(200).json(projects);
  } catch (error) {
    response.status(500).json({ error });
  }
}


async function getProjects(request, response) {
  try {
    const projects = await Projects.findAll();
    
    response.status(200).json(projects);
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to create a new bug
async function postBug(request, response) {
  try {
    const { name, status, priority, creationdate, description, commitLink, allocatedto, fixLink, userId, projectId } = request.body;
    console.log('received bug data:', request.body);
    
    if (name && status && priority && creationdate && userId && projectId) {
      const bug = await Bugs.create({
        name,
        status,
        priority,
        creationdate,
        description, // adăugat noul câmp
        commitLink, // adăugat noul câmp
        allocatedto, // adăugat noul câmp
        fixLink,
        userId,
        projectId,
        
      });
      
      response.status(201)
        .location(`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.baseUrl}${request.url}/${bug.id}`)
        .send();
    } else {
      response.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to create a new user
async function postUser(request, response) {
  try {
    const { username, password, usertype } = request.body;
    
    if (username && password && usertype) {
      const user = await Users.create({
        username,
        password,
        usertype,
      });
      
      response.status(201)
        .location(`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.baseUrl}${request.url}/${user.id}`)
        .send();
    } else {
      response.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to create a new project
async function postProject(request, response) {
  try {
    const { name, link, additionalMembers, userId } = request.body;
    
    if (name && link && userId && additionalMembers) {
      const project = await Projects.create({
        name,
        link,
        additionalMembers,
        userId,
      });
      
      response.status(201)
        .location(`${request.protocol}://${request.hostname}:${request.socket.localPort}${request.baseUrl}${request.url}/${project.id}`)
        .send();
    } else {
      response.status(400).json({ error: 'Bad Request: Missing required fields' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to update a bug by ID
async function putBug(request, response) {
  try {
    const bugId = request.params.id;
    const { name, status, priority, creationdate, description, commitLink, allocatedto, fixLink, userId, projectId } = request.body;
    
    const bug = await Bugs.findByPk(bugId);
    
    if (bug) {
      bug.name = name;
      bug.status = status;
      bug.priority = priority;
      bug.creationdate = creationdate;
      bug.description = description; // adăugat noul câmp
      bug.commitLink = commitLink; // adăugat noul câmp
      bug.allocatedto = allocatedto; // adăugat noul câmp
      bug.fixLink = fixLink; // adăugat noul câmp
      bug.userId = userId;
      bug.projectId = projectId;
      
      await bug.save();
      
      response.status(200).json(bug);
    } else {
      response.status(404).json({ error: 'Bug not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
    console.log(error);
  }
}

async function putMarkAsFixed(request, response) {
  try {
    const bugId = request.params.id;
    const { fixLink } = request.body;

    const bug = await Bugs.findByPk(bugId);

    if (bug) {
      bug.status = 'Rezolvat';
      bug.fixLink = fixLink;

      await bug.save();

      response.status(200).json(bug);
    } else {
      response.status(404).json({ error: 'Bug not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to update a user by ID
async function putUser(request, response) {
  try {
    const userId = request.params.id;
    const { username, password, usertype } = request.body;
    
    const user = await Users.findByPk(userId);
    
    if (user) {
      user.username = username;
      user.password = password;
      user.usertype = usertype;
      
      await user.save();
      
      response.status(200).json(user);
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to update a project by ID
async function putProject(request, response) {
  try {
    const projectId = request.params.id;
    const { name, link, additionalMembers, userId } = request.body;
    
    const project = await Projects.findByPk(projectId);
    
    if (project) {
      project.name = name;
      project.link = link;
      project.userId = userId;
      project.additionalMembers = additionalMembers;
      
      await project.save();
      
      response.status(200).json(project);
    } else {
      response.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to delete a bug by ID
async function deleteBug(request, response) {
  try {
    const bugId = request.params.id;
    const bug = await Bugs.findByPk(bugId);
    
    if (bug) {
      await bug.destroy();
      response.status(202).send();
    } else {
      response.status(404).json({ error: 'Bug not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to delete a user by ID
async function deleteUser(request, response) {
  try {
    const userId = request.params.id;
    const user = await Users.findByPk(userId);
    
    if (user) {
      await user.destroy();
      response.status(202).send();
    } else {
      response.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

// Method to delete a project by ID
async function deleteProject(request, response) {
  try {
    const projectId = request.params.id;
    const project = await Projects.findByPk(projectId);
    
    if (project) {
      await project.destroy();
      response.status(202).send();
    } else {
      response.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}


function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        reject(err);
      } else {
        resolve(user);
      }
    });
  });
}

/*
async function authenticateUser(request, response) {
  try {
    const { username, password } = request.body;
    const user = await Users.findOne({
      where: {
        username: username,
        password: password,
      },
    });

    if (user) {
      const userForToken = { username: username };
      const token = jwt.sign(userForToken, secretKey);

      response.status(200).json({ success: true, message: 'Autentificare reușită.', token });
    } else {
      response.status(401).json({ error: 'Utilizator sau parolă incorecte.' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
} */

async function authenticateUser(request, response) {
  try {
    const { username, password } = request.body;

    // Verifică dacă datele de autentificare sunt valide
    if (!username || !password) {
      return response.status(400).json({ error: 'Vă rugăm să furnizați atât username, cât și parola.' });
    }

    // Așteaptă un interval scurt pentru a încetini procesul de autentificare(protectie brute-force)
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = await Users.findOne({
      where: {
        username: username,
        password: password,
      },
    });

    if (user) {
      // Generează un token doar dacă datele de autentificare sunt corecte
      const userForToken = {
        username: user.username,
        id: user.id,
      };

      const token = jwt.sign(userForToken, secretKey);
      return response.status(200).json({ token });
    } else {
      return response.status(401).json({ error: 'Utilizator sau parolă incorecte.' });
    }
  } catch (error) {
    return response.status(500).json({ error });
  }
}
async function verifyUser(request, response) {
  try {
    const token = request.headers.authorization.split(' ')[1];
    const user = await verifyToken(token);

    if (user) {
      response.status(200).json({ user });
    } else {
      response.status(401).json({ error: 'Token invalid' });
    }
  } catch (error) {
    response.status(500).json({ error });
  }
}

module.exports = {
  getBug,
  getBugs,
  getBugsByProjectId,
  getUser,
  getUsers,
  getProjectsByUserId,
  getProjects,
  postBug,
  postUser,
  postProject,
  putBug,
  putUser,
  putProject,
  deleteBug,
  deleteUser,
  deleteProject,
  authenticateUser,
  verifyUser,
  getProject,
  putMarkAsFixed,
};
