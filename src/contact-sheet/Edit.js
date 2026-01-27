import React from 'react';
// import './styles/edit.css';



class Edit extends React.Component {

  state = {
    editingContact: null
  };

  componentDidUpdate(prevProps) {
    if (this.props.editingContact !== prevProps.editingContact) {
      this.setState({ editingContact: this.props.editingContact });
    }
  }

    handleInputChange = (field, value) => {
      this.setState(prevState => ({
        editingContact: {
          ...prevState.editingContact,
          [field]: value,
        },
      }));
    };

    handleSave = () => {
      this.props.onSave(this.state.editingContact);
    };


  render() {
    const { editingContact } = this.state;
    const { onClose } = this.props;

    if (!editingContact) return null;

    
    return(
      <div className="form-container">
            <strong>Edit Contact</strong>
            <form>
              <label>Name:
                <input required value={editingContact.name || ''}
                  type="text"
                  onChange={(e) => this.handleInputChange('name', e.target.value)}
                />
              </label>
              <label>Phone Number:
                <input required value={editingContact.phone || ''}
                  type="text" 
                  onChange={(e) => this.handleInputChange('phone', e.target.value)}
                />
              </label>
              <label>Email:
                <input required value={editingContact.email || ''} type="email" 
                  onChange={(e) => this.handleInputChange('email', e.target.value)}></input>
              </label>
              <label>Company:
                <input required value={editingContact.company || ''} type="text" 
                  onChange={(e) => this.handleInputChange('company', e.target.value)}></input>
              </label>
              <label>Notes:
                <textarea required value={editingContact.notes || ''}
                  type="textarea"
                  onChange={(e) => this
                  .handleInputChange('notes', e.target.value)}>
                </textarea>
              </label>
              <div className="form-btns">
                <button className="create-button" type="button" onClick={this.handleSave}>Save</button>
                <button className="create-button" type="button" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </div>
    	)
  }
};




export default Edit;