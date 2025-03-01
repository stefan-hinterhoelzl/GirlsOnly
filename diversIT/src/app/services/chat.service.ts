import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { child, getDatabase, onValue, orderByChild, push, ref, serverTimestamp, set, update, query, increment, onDisconnect, equalTo } from 'firebase/database'
import { collection, doc, getDocs, getFirestore, updateDoc, query as queryFirestore, arrayRemove, runTransaction } from '@firebase/firestore';
import { getApp } from "firebase/app";
import { getFunctions, connectFunctionsEmulator, httpsCallable } from "firebase/functions";
import { Chat, Message } from '../models/chat.model';
import { arrayUnion, where } from 'firebase/firestore';
import { BehaviorSubject, pipe } from 'rxjs';
import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { DiversITUser } from '../models/users.model';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { Router } from '@angular/router';
import { DomElementSchemaRegistry } from '@angular/compiler';
import { UserService } from './user.service';
import { take } from 'rxjs/operators';
import { ObserversService } from './observers.service';
import { MatGridTileHeaderCssMatStyler } from '@angular/material/grid-list';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /** realtime sdk database connection */
  database = getDatabase()

  /** to Update the Chatsarray in the user Field */
  firestore = getFirestore()

  /** Auth Instance to listen for auth changes */
  auth = getAuth()

  /** functions */
  functions = getFunctions(getApp());


  /**
   * Creates an instance of ChatService.
   * @param {SnackbarComponent} snackbar
   * @param {Router} router
   * @param {ObserversService} observer
   * @memberof ChatService
   */
  constructor(private snackbar: SnackbarComponent, private router: Router, private observer: ObserversService) {
  }

  /** subscription to chat */
  chatsub;
  /** list of all chat partners */
  currentChatPartners: DiversITUser[] = [];
  /** number which keeps track of unread messages */
  lastamount: number = 0;



  /**
   * initializes the chats for mentees and mentors accordingly 
   *
   * @param {DiversITUser} user
   * @memberof ChatService
   */
  initializeChat(user: DiversITUser) {
    if (user.role == 2) this.currentChatPartners = this.observer.getCurrentUserMenteesValue;
    if (user.role == 3) this.currentChatPartners = this.observer.getCurrentUserMentorsValue;
    this.getChatsOfUser(user)
  }

  /** queries for all chats of the provided user */
  getChatsOfUser(user: DiversITUser) {
    if (this.chatsub != null) this.chatsub();
    const userChatsRef = query(ref(this.database, user.uid), orderByChild("lastMessageTime"));
    this.chatsub = onValue(userChatsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const chats: Chat[] = []
        snapshot.forEach((childSnapshot) => {
          let chat = childSnapshot.val() as Chat
          if (chat.recipientUser != null) chats.push(chat)
        })
        chats.reverse()

        //there is a missing Chat Object
        if (chats.length < this.currentChatPartners.length) {
          //find the missing chatpartner
          for (let i = 0; i < this.currentChatPartners.length; i++) {
            let chat = chats.find((value) => { return value.recipientUser == this.currentChatPartners[i].uid });
            if (chat == undefined) {
              //create the chat object for the new user -- which triggers a rerun of this code
              this.createChat(user.uid, this.currentChatPartners[i].uid);
              return;
            }
          }
          //there is an additional chat object, pending for deletion
        } else if (chats.length > this.currentChatPartners.length) {
          for (let i = 0; i < chats.length; i++) {
            let chatpartner = this.currentChatPartners.find((value) => { return value.uid == chats[i].recipientUser })
            if (chatpartner == undefined) {
              //when the overflow chat was found -- delte that one -- triggers a rerun of this code
              this.deleteChat(chats[i], this.observer.getcurrenUserValue.uid);
              return;
            }
          }
        }

        //variable for the amount of new Messages
        let number: number = 0;

        //sorted Array for the Names of the Chat Partners
        const sortedarr: DiversITUser[] = []


        for (let i = 0; i < chats.length; i++) {
          let x = this.currentChatPartners.find((curr) => { return curr.uid == chats[i].recipientUser })
          sortedarr.push(x)
          number += chats[i].amountNewMessages
        }

        //Handle Amount of New Messages
        this.observer.number.next(number);

        //Handle the opening of the snackbar
        if (this.lastamount < number) {
          if (!this.router.url.includes("chat")) {
            if (number - this.lastamount == 1) {
              let snackBarRef = this.snackbar.openSnackBar("Sie haben " + (number - this.lastamount).toString() + " neue Nachricht", null, "zum Chat")
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/chat']);
              });
            }
            else {
              let snackBarRef = this.snackbar.openSnackBar("Sie haben " + (number - this.lastamount).toString() + " neue Nachrichten", null, "zum Chat")
              snackBarRef.onAction().subscribe(() => {
                this.router.navigate(['/chat']);
              });
            }
          }

          //set the new lastamount after the if conditions for the snackbar
          this.lastamount = number;

          //Play Message Sound
          let audio = new Audio();
          audio.src = "../../assets/sounds/ringtone.mp3";
          audio.load();
          audio.play();

        } else {
          this.lastamount = 0;
        }

        //Create the data for the Chat Observable
        const payload = {
          chats: chats,
          users: sortedarr,
        }

        this.observer.chats.next(payload);
      } else {
        if (this.currentChatPartners.length == 1) {
          this.createChat(user.uid, this.currentChatPartners[0].uid)
        } else if (this.currentChatPartners.length == 0) {
          this.observer.chats.next({
            chats: [],
            users: [],
          });
        }
      }
    });
  }



  /**
   * adds a relationship between a mentee and a mentor
   *
   * @param {string} mentee
   * @param {string} mentor
   * @memberof ChatService
   */
  async addRelationship(mentee: string, mentor: string) {
    const createRelationship = httpsCallable(this.functions, 'createRelationship');
    createRelationship({ mentee: mentee, mentor: mentor }).then((result) => {
      this.snackbar.openSnackBar("Vernetzung hergestellt!", "green-snackbar");

      //PLS Thomas Not to other user for accepting the request
    }).catch(()=> {
      this.snackbar.openSnackBar("Fehler beim Vernetzen", "red-snackbar")
    });
  }

  async revokeRelationship(mentee: string, mentor: string) {
    const revokeRelationship = httpsCallable(this.functions, "revokeRelationship");
    revokeRelationship({mentee: mentee, mentor: mentor}).then((result) => {
      this.snackbar.openSnackBar("Vernetzung gelöscht", "green-snackbar");
    });
  }


  /** deletes the chat instance between two users. Used when mentorship between a given mentee and a given mentor ends.  */
  async deleteChat(chat: Chat, currentUser: string) {
    //mentor and mentee chat objects

    //transactional updates on database
    const updates = {}
    updates['/' + currentUser + '/' + chat.uid] = null

    await update(ref(this.database), updates)

  }


  /**
   * initializes a chat between a mentee and a mentor
   *
   * @param {string} user id of current user navigating the application
   * @param {string} recipient id of mentor/mentee with which chat should be created
   * @memberof ChatService
   */
  async createChat(user: string, recipient: string) {
    let currentUser = this.observer.getcurrenUserValue;
    let newkey = "";

    if (currentUser.role == 3) newkey = recipient + user;
    else newkey = user + recipient;
    
    const newChat = <Chat>{
      uid: newkey,
      lastMessage: "",
      recipientUser: recipient,
      amountNewMessages: 0,
      lastCheckedTime: serverTimestamp(),
      lastMessageTime: serverTimestamp(),
      currentlyOnline: false,
    }

    const updates = {};
    updates['/' + user + '/' + newkey] = newChat;

    await update(ref(this.database), updates);
  }



  /**
   * adds a message to the realtimedatabase. 
   *
   * @param {Chat} chat the chat to which the message should be pushed.
   * @param {string} text content of message
   * @param {DiversITUser} sender user who sent the message
   * @memberof ChatService
   */
  sendMessage(chat: Chat, text: string, sender: DiversITUser) {
    const newMessageKey = push(child(ref(this.database), "messages")).key;

    const message = <Message>{
      text: text,
      senderUID: sender.uid,
      timestamp: serverTimestamp(),
    };



    const updates = {}
    const ChatRef = ref(this.database, sender.uid + "/" + chat.uid);
    onValue(ChatRef, (snapshot) => {
      const data = snapshot.val() as Chat;

      if (!data.currentlyOnline) {
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessage"] = text;
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();
        updates[chat.recipientUser + "/" + chat.uid + "/amountNewMessages"] = increment(1);
      } else {
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessage"] = text;
        updates[chat.recipientUser + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();
      }

      updates[sender.uid + "/" + chat.uid + "/lastMessage"] = text;
      updates[sender.uid + "/" + chat.uid + "/lastMessageTime"] = serverTimestamp();

      updates["messages/" + chat.uid + "/" + newMessageKey] = message;

      update(ref(this.database), updates);

    }, {
      onlyOnce: true
    });
  }

  
  /**
   * queries for all messages of a chat
   *
   * @param {Chat} chat
   * @return {*} 
   * @memberof ChatService
   */
  getMessages(chat: Chat) {
    const messagesRef = query(ref(this.database, "messages/" + chat.uid), orderByChild("timestamp"));
    return onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        const messages: Message[] = []
        snapshot.forEach((childSnapshot) => {
          messages.push(childSnapshot.val() as Message)
        })
        messages.reverse();
        this.observer.messages.next(messages);
      } else {
        this.observer.messages.next([]);
      }
    });
  }



  /**
   *  opens the chatwindow and sets the status to online which can be seen by the according chat partner.
   * This also resets the unread chat message counter to 0
   *
   * @param {Chat} chat
   * @param {DiversITUser} user
   * @return {*} 
   * @memberof ChatService
   */
  openChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline"] = true;
    updates[this.database, user.uid + "/" + chat.uid + "/amountNewMessages"] = 0;

    const r = ref(this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline")
    const o = onDisconnect(r);
    o.set(false);

    return update(ref(this.database), updates);
  }


  /**
   * sets the users state to offline for the chat partners and saves the last online time. 
   * 
   * @param chat 
   * @param user 
   * @returns 
   */
  closeChat(chat: Chat, user: DiversITUser) {
    const updates = {}
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/currentlyOnline"] = false;
    updates[this.database, chat.recipientUser + "/" + chat.uid + "/lastCheckedTime"] = serverTimestamp();

    return update(ref(this.database), updates);
  }

}
