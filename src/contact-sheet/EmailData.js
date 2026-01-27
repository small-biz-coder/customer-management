import React from 'react';
import './styles/EmailData.css';


class EmailData extends React.Component {

	render() {
		const { dataPerUser } = this.props;

		const emailCheck = () => {
			if (!dataPerUser) {
				return null;
			} else {
		        const emailChecker = (fromString) => {
			    const match = fromString.match(/^"?([^"<]+)"?/);
		        return match ? match[1].trim() : fromString;
	            }
	            const name = dataPerUser
				.find(nm=> nm.folder === 'INBOX' || nm.folder === 'Sent');
				const emailSender = name ?
				(name.folder === 'INBOX' ? name.from : name.to) : null;
		        return { emailChecker, emailSender };
			}
		};

		const result = emailCheck();

		if (!result) {
			return (
				<div className="email-data-container">
					<div
						className="window-exit"
						onClick={this.props.closeWindow}>
						<span className="line1"></span>
						<span className="line2"></span>
					</div>
					<h1>No email history for this customer yet.</h1>
				</div>
			);
		}

		const { emailChecker, emailSender } = result;
		
		const subjectGroup = () => {
			if (emailSender) {
				const reSubjects = [...new Set(
					dataPerUser
						.filter(item => item.subject?.toLowerCase().startsWith('re:'))
		                // .map(item => item.subject)
		        )]
			}
		};
		// const groupedSubjects = reSubjects 
		subjectGroup();
		// console.log(reSubjects)

		return (
			<div className="email-data-container">
				<div
					className="window-exit"
					onClick={this.props.closeWindow}>
					<span className="line1"></span>
					<span className="line2"></span>
				</div>
				<h1>Email history for: {emailChecker(emailSender)}
				</h1>
				{dataPerUser.map((item, i) => (
				<section key={i}>
					<span>Subject: {item.subject}</span>
					<span>Date: {new Date(item.date).toLocaleDateString('en-us')}</span>
			    </section>
				))}
			</div>
		)
	}
}



export default EmailData;