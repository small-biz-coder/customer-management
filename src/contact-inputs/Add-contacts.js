import React from 'react';
import './styles/add-contacts.css';


class AddContact extends React.Component {
  state = {
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  }

handleInputs = (event) => {
  this.setState({ [event.target.name]: event.target.value});
}

handleSave = (event) => {
  event.preventDefault();
  this.props.onSave(this.state);
  //clear form after entry 
  this.setState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: ''
  });
}


  render() {
    const { name, email, phone, company, notes } = this.state;

    return(
       <div>
          <div className="form-container">
            <strong>Create Contact</strong>
            <form onSubmit={this.handleSave}>
              <label>Name:
                <input placeholder="Enter name here"
                  required name="name"
                  value={name}
                  type="text"
                  onChange={this.handleInputs}
                />
              </label>
              <label>Phone Number:
                <input placeholder="Enter phone number here"
                  type="text"
                  value={phone} 
                  name="phone"
                  onChange={this.handleInputs}
                />
              </label>
              <label>Email:
                <input placeholder="Enter email here"
                  type="email" 
                  value={email}
                  name="email"
                  onChange={this.handleInputs}
                />
              </label>
              <label>Company:
                <input placeholder="Enter company name here"
                  type="text" 
                  value={company}
                  name="company"
                  onChange={this.handleInputs}
                />
              </label>
              <label>Notes:
                <textarea placeholder="Enter notes for this customer"
                  type="textarea" 
                  value={notes}
                  name="notes"
                  onChange={this.handleInputs}
                />
              </label>
              <div className="form-btns">
                <button className="create-button"
                  type="submit">Save
                </button>
                <button className="create-button"
                  type="button" onClick={this.props.onCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
       </div>
      )
  }
};



export default AddContact;




