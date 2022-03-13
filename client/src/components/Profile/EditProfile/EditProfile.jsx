/* eslint-disable prettier/prettier */
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../../Common/TextFieldGroup";
import isEmpty from "../../../validation/is-empty";
import "../Profile.less";
import "../CreateProfile/CreateProfile.less";
import { connect } from "react-redux";
import {
  getCurrentProfile,
  createProfile,
} from "../../../actions/profileActions";
import ButtonAction from "../../Common/ButtonAction";

class EditProfile extends Component {
  constructor() {
    super();
    this.state = {
      website: "",
      location: "",
      errors: {},
    };
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      profile.website = !isEmpty(profile.website) ? profile.website : "";
      profile.location = !isEmpty(profile.location) ? profile.location : "";
      this.setState({
        website: profile.website,
        location: profile.location,
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      errors: {
        ...this.state.errors,
        [e.target.name]: "",
      },
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      website,
      location,
    } = this.state;

    const newProfile = {
      website,
      location,
    };

    this.props.createProfile(newProfile);
    this.props.history.push("/profile");
  };

  render() {
    const { screenWidth } = this.props.screenWidth;
    const { errors } = this.state;
    const {
      website,
      location,
    } = this.state;
    let customWidth = screenWidth / 2.2;

    return (
      <div className="custom-container" style={{ width: "60%" }}>
        <div className="create-profile-container">
          <Fragment>
            <h3>Edit profile</h3>
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
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  errors: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  createProfile: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  profile: state.profile,
  screenWidth: state.screenWidth,
});

export default connect(mapStateToProps, { getCurrentProfile, createProfile })(
  withRouter(EditProfile)
);
