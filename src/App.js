import React from 'react';
import Contacts from './contact-sheet/Contacts';
import AddContacts from './contact-inputs/Add-contacts';
import Edit from './contact-sheet/Edit';
import search from './search.svg';
import Email from './contact-sheet/Email';
import EmailData from './contact-sheet/EmailData';

import './styles/App.css';


class App extends React.Component {
  


  constructor() {
    super();
    this.state = {
      customers: [],
      editingContact: null,
      showAddContact: false,
      searchField: '',
      sortOrder: 'desc',
      currentSortKey: null,
      groupedEmails: {},
      emailsLoading: false,
      custEmails: [],
      newEmails: [],
      emailData: {},
      showEmailDataId: null
    };
  };


  componentDidUpdate(prevProps, prevState) {
    const groupedChanged = prevState.groupedEmails !== this.state.groupedEmails;
    const newEmailsChanged = prevState.newEmails !== this.state.newEmails;

    if (groupedChanged || newEmailsChanged) {
      this.updateLastContactValues();
    }
  };

  updateLastContactValues = () => {
    const { groupedEmails, customers, newEmails } = this.state;
      
    if (customers.length === 0) return;

    const noHistEmails = Array.isArray(newEmails)
    ? newEmails
    : newEmails?.noHistory || [];

    const noHistSet = new Set(
      noHistEmails.map(i => i?.toLowerCase?.().trim())
      .filter(Boolean)
      );

      const latestDates = {};

      Object.entries(groupedEmails).forEach(([email, emailArray]) => {
        if (emailArray.length > 0) {
          const latestIso = emailArray[0].date;
          const dateObj = new Date(latestIso);
          latestDates[email] = dateObj.toLocaleString('en-us', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit'
          });
        } 
      });
      const updatedCustomers = customers.map(customer => {
        const email = customer.email?.toLowerCase?.()?.trim();
        if (!email || !customer.email) {
          return {
            ...customer,
            last_contact: 'Enter valid email'
          };
        }

        if (latestDates[email]) {
          return {
            ...customer,
            last_contact: latestDates[email]
          };
        }
        if (noHistSet.has(email)) {
          return {
            ...customer,
            last_contact: 'Never Contacted'
          };
        }
        return {
          ...customer,
          last_contact: customer.last_contact || 'No contact record'
        };
      });

      this.setState({ customers: updatedCustomers });
  };

  async componentDidMount() {
    const { customers, emailsLoading } = this.state;
    
    try {
      let customerData = '';
      customerData = 'loading...'
      const response = await fetch('http://localhost:8000/contacts')
      const contacts = await response.json();

      const updatedContacts = contacts.map(customer => ({
        ...customer,
        addLoadingSpinner: true
      }));
      customerData = updatedContacts
      const emails = contacts.map(cust => cust.email);
      this.setState({
        customers: customerData,
        custEmails: emails
      });
    } catch (err) {
        console.error('Error fetching contacts:', err);
      }
  };

  toggleAddContact = () => {
    this.setState({ showAddContact: !this.state.showAddContact });
  };

  handleFormSubmit = (data) => {
    fetch('http://localhost:8000/', {
    method: 'post',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      const emails = result.email;
      this.setState({
      customers: [...this.state.customers, result],
      showAddContact: false,
      custEmails: [...this.state.custEmails, emails]
      });
    })
    .catch(err => {
      console.error('error in client', err);
      alert('Failed to save contact');
    });
  };

  handleEditClick = (entry) => {
    this.setState({ editingContact: entry });
  };

  handleEditSave = (data) => {
  fetch(`http://localhost:8000/edit/${data.id}`, {
  method: 'put',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(updatedContact => {
      const emails = updatedContact.email;
      this.setState({
        customers: this.state.customers.map(contact =>
          contact.id === updatedContact.id ? updatedContact : contact
          ),
        editingContact: null,
        custEmails: [...this.state.custEmails, emails]
          
      });
    alert('Contact Updated');
    })
    .catch(err => {
        console.error('error in client, updating', err);
        alert('Failed to update contact');
      });    
  };

  closeEditJs = () => {
    this.setState({ editingContact: null })
  };

  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value})
  };

  ascendDescend = (sortKey) => {
  const { customers, sortOrder, currentSortKey } = this.state;

  let newSortOrder;
    if (currentSortKey === sortKey) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortOrder = 'asc';
    }
  
  
  const sortedContacts = [...customers]
  .sort((a, b) => {
    let aValue = a[sortKey];
    let bValue = b[sortKey];

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
    }
    if (typeof bValue === 'string') {
      bValue = bValue.toLowerCase();
    }

    if (aValue === '' || aValue === null
      || aValue === null) {
      return 1;
    }
    if (bValue === '' || bValue === null
      || bValue === null) {
      return -1;
    }

    if (newSortOrder === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
      return 0;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
      return 0;
    }
  });

  this.setState({
    customers: sortedContacts,
    sortOrder: newSortOrder,
    currentSortKey: sortKey
  });
  };
 
  handleEmailGrouping = (groupedEmails) => {
  this.setState({ groupedEmails });
  };

  handleEmailLoading = (boole) => {
      this.setState({ emailsLoading: boole });
  };

  handleNewEmails = (data) => {
      this.setState({ newEmails: data });
  };

  openEmailData = (entry) => {
    const { groupedEmails, showEmailData } = this.state;
    this.setState({ showEmailDataId: entry.id });
    const emailData = groupedEmails[entry.email];
    this.setState({ emailData });
  };

  handleEmailDataWindow = () => {
    this.setState({ showEmailDataId: null });
  };

  render() {
    const { searchField, customers } = this.state;
    const filterContacts = customers.filter(row => {
      return (row.name.toLowerCase()
      .includes(searchField.toLowerCase()))
      || (row.company.toLowerCase()
      .includes(searchField.toLowerCase()))
      || (row.email.toLowerCase()
      .includes(searchField.toLowerCase()));
    });

    return (
      <div className="home">
        <h1>Your Contacts</h1>
          <div id="header-btns">
            <button>
              Filter
            </button>
            <div className="search-box">
              <img src={search} alt="" />
              <input 
                type="search" placeholder="Search"
                onChange={this.onSearchChange}
              />
           </div>
            <button onClick={this.toggleAddContact}>
              Create New 
            </button>
          </div>
        <section id="contacts-Wleft-icons">
          <ul>
            <li>CT</li>
            <li>EM</li>
            <li>OP</li>
            <li>LD</li>
          </ul>
          <Contacts 
            onEditClick={this.handleEditClick}
            data={filterContacts}
            onSort={this.ascendDescend}
            onEmailClick={this.openEmailData}
          />
          <Edit
            editingContact={this.state.editingContact}
            onSave={this.handleEditSave}
            onClose={this.closeEditJs}
          />
        </section>
        {this.state.showAddContact && (
          <AddContacts 
            onSave={this.handleFormSubmit} 
            onCancel={this.toggleAddContact}
          />
        )}
          <Email
            onUpdate={this.handleEmailGrouping}
            whenFetching={this.handleEmailLoading}
            customerEmails={this.state.custEmails}
            newEmails={this.handleNewEmails}
          />
          {this.state.showEmailDataId && (
            <EmailData
            dataPerUser={this.state.emailData}
            closeWindow={this.handleEmailDataWindow}
            />
            )}
          
      </div>
    );
  }
}

export default App;
