const express = require('express');
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const db = knex({
	client: 'pg',
	connection: {
		host : '127.0.0.1',
		user : '',
		password : '',
		database : 'crm'
	}
});


const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));


//Imap
const imapConfig = {
  user: 'andrew@harvestclicks.com',
  password: process.env.PASSWORD,
  host: 'Imap0001.neo.space',
  port: process.env.PORT,
  tls: true,
  tlsOptions: { rejectUnauthorized: false } 
};

async function fetchCustEmail(custEmail) {
  return new Promise((resolve, reject) => {
    const imap = new Imap(imapConfig);
    const allEmails = [];

    imap.once('ready', () => {
      // Search folders sequentially, not in parallel
      searchFolder('INBOX', [['HEADER', 'FROM', custEmail.trim()]], 'received', () => {
        // After INBOX is done, search Sent
        searchFolder('Sent', [['HEADER', 'TO', custEmail.trim()]], 'sent', () => {
          // Both folders done
          imap.end();
          allEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
          resolve(allEmails);
        });
      });
    });

    function searchFolder(folderName, searchCriteria, direction, callback) {
      imap.openBox(folderName, true, (err, box) => {
        if (err) {
          console.error(`Error opening ${folderName}:`, err);
          return callback();
        }


        imap.search(searchCriteria, (err, results) => {
          if (err) {
            console.error(`Search error in ${folderName}:`, err);
            return callback();
          }


          if (!results || results.length === 0) {
            return callback();
          }

          const fetch = imap.fetch(results, { bodies: '' });
          let processedCount = 0;
          const totalMessages = results.length;

          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (err) {
                  console.error('Parse error:', err);
                } else {
                  
                  allEmails.push({
                    subject: parsed.subject,
                    from: parsed.from.text,
                    to: parsed.to.text,
                    date: parsed.date,
                    direction: direction,
                    folder: folderName
                  });
                }

                processedCount++;

                // When all messages in this folder are processed
                if (processedCount === totalMessages) {
                  
                  callback();
                }
              });
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            callback();
          });
        });
      });
    }

    imap.once('error', reject);
    imap.connect();
  });
}
        
           

app.get('/api/emails/:custEmail', async (req, res) => {
  try {
    const { custEmail } = req.params;
    const emails = await fetchCustEmail(custEmail);

    if (emails.length === 0) {
      return res.status(200).json({
        success: true,
        emails: []
      });
    }

    res.status(200).json({
      success: true,
      emails
    });

  } catch (error) {
    console.error('error fetching emails:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'failed to fetch emails'
    });
  }
});

app.get('/contacts', (req, res) => {
  db.select('*')
    .from('contacts')
    .then(contacts => {
      res.json(contacts);
    })
    .catch(err => res.status(400).json('unable to get contacts', err));
});

app.post('/', (req, res) => {
	const { name, email, phone, company, notes } = req.body;
    db.insert({
    	name: name,
    	email: email,
    	phone: phone,
    	company: company,
    	date_created: new Date(),
      notes: notes
    })
    .into('contacts')
    .returning('*')
    .then(contact => {
    	res.json(contact[0]);
    })
	.catch(err => res.status(400).json('unable to create'));
});

app.put('/edit/:id', (req, res) => {
	const { name, email, phone, company, notes } = req.body;
	const { id } = req.params;
    db('contacts')
    .where({ id: Number(id) })
    .update({
    	name,
    	email,
    	phone,
    	company,
      notes
    })
    .returning("*")
    .then(updated => {
    	if (updated.length === 0) {
    		return res.status(404).json({ error: 'contact not updated'});
    	}
    	res.json(updated[0]);
    })
	.catch(err => res.status(400).json('unable to update'));
})




app.listen(8000, () => {
	console.log('we are on');
});





