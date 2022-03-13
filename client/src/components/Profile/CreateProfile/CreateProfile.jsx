import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import "./CreateProfile.less";
import TextFieldGroup from "../../Common/TextFieldGroup";
import { connect } from "react-redux";
import { createProfile } from "../../../actions/profileActions";
import ButtonAction from "../../Common/ButtonAction";
import Footer from "../../Footer/Footer";

class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      createProfileClicked: false,
      website: "",
      location: "",
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: ""
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const {
      website,
      location
      //name
    } = this.state;

    const newProfile = {
      website,
      location
    };

    this.props.createProfile(newProfile);
  };

  render() {
    const { user, screenWidth } = this.props;
    const { errors } = this.state;
    const {
      createProfileClicked,
      website,
      location
      //name
    } = this.state;
    let customWidth = screenWidth / 2.2;

    let createProfileDisplay = createProfileClicked ? (
      <Fragment>
        <h3>Create a short profile</h3>
        <TextFieldGroup
          name={"website"}
          placeholder={"www.mysite.com"}
          value={website}
          handleChange={this.handleChange}
          type={"text"}
          info={"Link to your website"}
          customWidth={customWidth}
          error={errors.website}
        />
        <TextFieldGroup
          name={"location"}
          placeholder={"Toronto, Ontario"}
          value={location}
          handleChange={this.handleChange}
          type={"text"}
          info={"Location"}
          customWidth={customWidth}
        />

        <ButtonAction
          callback={this.handleSubmit}
          name={"Submit"}
          additionalStyle={"submit-button"}
        />
      </Fragment>
    ) : (
      <Fragment>
        <img className="profile-avatar" src={user.avatar} alt="" />
        <h3>Hello {user.name.split(" ")[0]}!</h3>
        <p>Looks like you don't have a profile yet.</p>
        <p>Please create one.</p>
        <ButtonAction
          callback={() => this.setState({ createProfileClicked: true })}
          name={"Create profile"}
        />
        <Footer />
      </Fragment>
    );
    return (
      <div className="create-profile-container">{createProfileDisplay}</div>
    );
  }
}

CreateProfile.propTypes = {
  user: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  createProfile: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(mapStateToProps, { createProfile })(
  withRouter(CreateProfile)
);
