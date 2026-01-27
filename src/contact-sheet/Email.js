import React from 'react';

class Email extends React.Component {
  state = {
    allEmails: [],
    error: null
  };


//fetch emails after props load, and group emails after state loads
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.customerEmails !== this.props.customerEmails) {
    this.fetchCustomerEmails(this.props.customerEmails);
    }

    if (prevState.allEmails !== this.state.allEmails) {
      this.groupEmails();
      const getDates = this.state.allEmails.map(emails => emails.date);
      this.setState({ emailDates: getDates[0] })
    }
  };

  // Fetch emails for a specific customer
  fetchCustomerEmails = async (emailAddresses) => {
    if (!Array.isArray(emailAddresses) || emailAddresses.length === 0) return;
  this.setState({ error: null });
  this.props.whenFetching(true);

  try {
      const promises = emailAddresses.map(async (email) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 45000);

        try {
          const response = await fetch(
            `http://localhost:8000/api/emails/${encodeURIComponent(email)}`,
            { signal: controller.signal }
          );

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`Failed for ${email}: ${response.status}`);
          }

          const data = await response.json();
          
          if (!data.success) {
            console.warn(`server reported failure for ${email}`, data);
            return [];
          }
          const all = data.emails || [];
          const withoutHistory = all.length === 0;

          return { all, withoutHistory, email };

        } catch (err) {
          if (err.name === 'AbortError') {
            console.warn(`Timeout aborted for ${email}`);
          } else {
          console.warn(`Failed to load emails for ${email}:`, err);
          }
          return { email, all: [], withoutHistory: true }; 
        }
      });

      const results = await Promise.all(promises);
      const allEmailsFlat = results.flatMap(r => r.all);
      const withoutHistoryFlat = results
      .filter(r => r.withoutHistory)
      .map(r => r.email);

      this.setState({ allEmails: allEmailsFlat });
      this.props.newEmails({ noHistory: withoutHistoryFlat });
    } catch (error) {
      console.error("Bulk email fetch failed:", error);
      this.setState({ error: error.message || "Failed to load emails" });
    } finally {
      this.props.whenFetching?.(false);
    }
  };
  

//group emails and send to parent
  groupEmails = () => {
    const { allEmails } = this.state;
    const trackedSet = new Set(this.props.customerEmails.map(email => email.toLowerCase()));
    const groupedEmails = allEmails.reduce((acc, email) => {

      const fromMatch = email.from.match(/<(.+?)>/);
      const fromEmail = fromMatch ? fromMatch[1].toLowerCase() : email.from.toLowerCase().trim();

      let matchedCustomer = null;

        if (trackedSet.has(fromEmail)) {
          matchedCustomer = fromEmail;
        } else {
          const toMatch = email.to.match(/<(.+?)>/);
          const toEmail = toMatch ? toMatch[1].toLowerCase() : email.to.toLowerCase().trim();
          if (trackedSet.has(toEmail)) {
            matchedCustomer = toEmail;
          }
        }
        const groupKey = matchedCustomer || 'other';
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      acc[groupKey].push(email);
      return acc;
      }, {});
    this.props.onUpdate(groupedEmails);
  };

render() {
    return(
      <div> 
      </div>
    )
  }
}

export default Email;


