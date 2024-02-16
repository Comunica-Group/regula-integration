import React, { Component } from 'react';

class PasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  handleChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { password } = this.state;
    if (password === process.env.REACT_APP_PASSWORD) {
      this.props.onPasswordCorrect();
    } else {
      alert('Incorrect password. Please try again.');
      this.setState({ password: '' });
    }
  };

  render() {
    return (
      <div className="password-form">
        <h1>Password Required</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Password:
            <input
              type="password"
              value={this.state.password}
              onChange={this.handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

export default PasswordComponent;
