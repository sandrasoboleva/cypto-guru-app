import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./Profile.less";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../actions/profileActions";
import { createPortfolio } from "../../actions/tradeActions";
import CreateProfile from "./CreateProfile/CreateProfile";
import Spinner from "../Common/Spinner";
import ButtonAction from "../Common/ButtonAction";

class Profile extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  handleDelete = e => {
    this.props.deleteAccount();
  };

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { screenWidth } = this.props.screenWidth;

    let profileDisplay;

    if (profile === null || loading) {
      profileDisplay = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        profileDisplay = (
          <Fragment>
            <h4 className="profile-header">Profile</h4>
            <div className="profile-container">
              <div className="left-side-wrapper">
                <img
                  src={user.avatar}
                  className="profile-picture"
                  alt="avatar"
                />
                <h4>{user.name}</h4>
                {profile.location ? (
                  <div className="location-wrapper">
                    <i className="fa fa-map-marker" />
                    <p>{profile.location}</p>
                  </div>
                ) : (
                  ""
                )}

                {profile.website ? (
                  <div className="website-wrapper">
                    <i className="fa fa-globe" />
                    <p
                      onClick={() =>
                        window.open(`https://${profile.website}`, "_blank")
                      }
                    >
                      {profile.website}
                    </p>
                  </div>
                ) : (
                  ""
                )}

                {screenWidth > 1024 ? (
                  <Fragment>
                    <Link to="/">
                      <ButtonAction
                        name="dashboard"
                        additionalStyle={"btn-dashboard"}
                      />
                    </Link>
                    <p
                      onClick={this.handleDelete}
                      className="delete-account-link"
                    >
                      Delete Account
                    </p>
                  </Fragment>
                ) : null}
              </div>
            </div>
          </Fragment>
        );
      } else {
        profileDisplay = (
          <CreateProfile user={user} screenWidth={screenWidth} />
        );
      }
    }

    return (
      <div className="custom-container" style={{ width: "60%" }}>
        {profileDisplay}
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  trade: PropTypes.object.isRequired,
  screenWidth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  createPortfolio: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile,
  trade: state.trade,
  screenWidth: state.screenWidth
});

export default connect(mapStateToProps, {
  getCurrentProfile,
  deleteAccount,
  createPortfolio
})(Profile);
