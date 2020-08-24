import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from 'auto-bind';
import { View } from 'react-native';
import { Chip, Dialog, Portal, Text, Button, Surface, TextInput, Paragraph } from 'react-native-paper';
import KeyboardAwareDialog from './KeyBoardAwareDialog';

const DialogType = Platform.OS === 'ios' ? KeyboardAwareDialog : Dialog;

import config from '../config';
import styles from '../assets/styles/blink/_InviteParticipantsModal.scss';

class EditConferenceModal extends Component {
    constructor(props) {
        super(props);
        autoBind(this);

        let users = '';
        if (this.props.invitedParties && this.props.invitedParties.length > 0) {
            users = this.props.invitedParties;
        } else if (this.props.selectedContact && this.props.selectedContact.participants) {
            users = this.props.selectedContact.participants;
        }

        this.state = {
            users: users.toString(),
            selectedContact: this.props.selectedContact,
            invitedParties: this.props.invitedParties
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        let users = '';
        if (nextProps.invitedParties && nextProps.invitedParties.length > 0) {
            users = nextProps.invitedParties;
        } else if (nextProps.selectedContact && nextProps.selectedContact.participants) {
            users = nextProps.selectedContact.participants;
        }

        this.setState({
            users: users.toString(),
            selectedContact: nextProps.selectedContact,
            invitedParties: nextProps.invitedParties
        });
    }

    saveParticipants(event) {
        event.preventDefault();
        const uris = [];
        if (this.state.users) {
            this.state.users.split(',').forEach((item) => {
                item = item.trim();
                if (item.indexOf('@') === -1) {
                    item = `${item}@${this.props.defaultDomain}`;
                }

                let username = item.split('@')[0];
                if (username && username !== ',') {
                    uris.push(item);
                }
            });
        }

        if (uris) {
            this.props.saveInvitedParties(uris);
            this.setState({users: null});
        }
        this.props.close();
    }

    onInputChange(value) {
        this.setState({users: value});
    }

    render() {
        return (
            <Portal>
                <DialogType visible={this.props.show} onDismiss={this.props.close}>
                    <Surface style={styles.container}>
                        <Dialog.Title style={styles.title}>{this.props.room}</Dialog.Title>
                          <Dialog.Content>
                            <Paragraph>People you wish to invite automatically to the conference when you join the room:</Paragraph>
                          </Dialog.Content>
                        <TextInput
                            mode="flat"
                            name="users"
                            label="People"
                            onChangeText={this.onInputChange}
                            value={this.state.users}
                            placeholder="Enter accounts separated by ,"
                            required
                            autoCapitalize="none"
                        />

                        <View style={styles.buttonRow}>
                        <Button
                            mode="contained"
                            style={styles.button}
                            onPress={this.saveParticipants}
                            icon="email">Save
                        </Button>
                        </View>
                    </Surface>
                </DialogType>
            </Portal>
        );
    }
}

EditConferenceModal.propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    saveInvitedParties: PropTypes.func,
    invitedParties: PropTypes.array,
    room: PropTypes.string,
    selectedContact: PropTypes.object,
    defaultDomain: PropTypes.string
};

export default EditConferenceModal;