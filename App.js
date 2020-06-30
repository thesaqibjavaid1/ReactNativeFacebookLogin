import React, {Component} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Button,
  NativeModules,
} from 'react-native';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';

export default class App extends Component {
  state = {
    isLoggedIn: false,
    userInfo: [],
  };
  //Create response callback.
  _responseInfoCallback(error, result) {
    if (error) {
      console.log('Error fetching data: ' + error);
    } else {
      console.log('Success fetching data: ' + result.email);
    }
  }

  _facebookSignIn = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      if (result.isCancelled) {
        // handle this however suites the flow of your app
        throw new Error('User cancelled request');
      } else {
        const infoRequest = new GraphRequest(
          '/me',
          {
            parameters: {
              fields: {
                string: 'email,name,first_name,middle_name,last_name',
              },
            },
          },
          this._responseInfoCallback,
        );
        // Start the graph request.
        new GraphRequestManager().addRequest(infoRequest).start();
      }

      console.log(
        `Login success with permissions: ${result.grantedPermissions.toString()}`,
      );

      // get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        // handle this however suites the flow of your app
        throw new Error(
          'Something went wrong obtaining the users access token',
        );
      }
    } catch (e) {
      console.error(e);
    }
  };
  handleLogout() {
    this.setState({
      isLoggedIn: false,
    });
  }

  render() {
    const {isLoggedIn} = this.state;
    return (
      <View style={styles.container}>
        {isLoggedIn ? (
          <Text
            style={{
              fontSize: 18,
              color: 'black',
              padding: 10,
            }}>
            {this.state.userInfo &&
              this.state.userInfo.user &&
              this.state.userInfo.user.name}
          </Text>
        ) : (
          <Button
            name="logo-twitter"
            style={styles.button}
            onPress={this._facebookSignIn}
            title="Login with Facebook"
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1b95e0',
    color: 'white',
    width: 100,
    height: 0,
  },
});
