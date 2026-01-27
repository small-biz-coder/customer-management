import React from 'react';
import './styles/Contacts.css';



class Contacts extends React.Component {
  state = {
    name: 'Name',
    phone: 'Phone #',
    email: 'Email',
    company: 'Company',
    notes: 'Notes',
    leadStatus: 'Lead Status',
    dateCreated: 'Date Created',
    lastContact: 'Last Contact',
    edit: 'Edit'
  };

  render() {
    const { name, phone, email, company, notes, leadStatus,
    dateCreated, lastContact, edit } = this.state;
    const { data, onEditClick, onSort, onEmailClick } = this.props;
    

    return(
      <div>
        <div className="table-div">
          <table>
            <thead>
              <tr>
                <th id="h-c1">
                  <button onClick={() => onSort('name')}>
                    {name}
                  </button>
                </th>
                <th id="h-c2">
                  <button onClick={() => onSort('phone')}>
                    {phone}
                  </button>
                </th>
                <th id="h-c3">
                  <button onClick={() => onSort('email')}>
                    {email}
                  </button>
                </th>
                <th id="h-c4">
                  <button onClick={() => onSort('company')}>
                    {company}
                  </button>
                </th>
                <th id="h-c5">
                  <button onClick={() => onSort('notes')}>
                    {notes}
                  </button>
                </th>
                <th id="h-c6">
                  <button onClick={() => onSort('last_contact')}>
                    {lastContact}
                  </button>
                </th>
                <th id="h-c7">
                  <button onClick={() => onSort('lead_status')}>
                    {leadStatus}
                  </button>
                </th>
                <th id="h-c8">
                  <button onClick={() => onSort('date_created')}>
                    {dateCreated}
                  </button>
                </th>
                <th id="h-c9">{edit}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, i) => (
                <tr key={entry.id || i}>
                  <td id="b-c1" onDoubleClick={() => onEditClick(entry)}>
                    {entry.name}
                  </td>
                  <td id="b-c2" onDoubleClick={() => onEditClick(entry)}>
                    {entry.phone}
                  </td>
                  <td id="b-c3" onDoubleClick={() => onEditClick(entry)}>
                    {entry.email}
                  </td>
                  <td id="b-c4" onDoubleClick={() => onEditClick(entry)}>
                    {entry.company}
                  </td>
                  <td id="b-c5" onDoubleClick={() => onEditClick(entry)}>
                    {entry.notes}
                  </td>
                  <td id="b-c6" onClick={() => onEmailClick(entry)}>
                    {entry.last_contact ?? <div className="spinner-box">
                      <span className="spinner"></span></div>}
                  </td>
                  <td id="b-c7" onDoubleClick={() => onEditClick(entry)}>
                    {entry.lead_status ? 'Open' : 'Closed'}
                  </td>
                  <td id="b-c8" onDoubleClick={() => onEditClick(entry)}>
                    {new Date(entry.date_created)
                    .toLocaleDateString('en-US')}
                  </td>
                  <td id="b-c9">
                    <button onClick={() => onEditClick(entry)}>
                      Edit
                    </button>
                  </td>
                </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
      );
  }
}

export default Contacts;