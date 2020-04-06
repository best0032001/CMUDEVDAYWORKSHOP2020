<template>
  <v-container>
    <v-app id="inspire">
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
      >
        <!--<template v-slot:activator="{ on }">
                    <v-btn color="primary" dark v-on="on">Open Dialog</v-btn>
                </template>-->
        <v-card>
          <v-toolbar dark color="primary">
            <!--<v-btn icon dark @click="dialog = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>-->
            <v-toolbar-title>CMUPAC LOGOUT</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--<v-toolbar-items>
                            <v-btn dark text @click="dialog = false">Save</v-btn>
                        </v-toolbar-items>-->
          </v-toolbar>
          <v-list three-line subheader>
            <v-subheader>User Controls</v-subheader>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Logout successful</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
        </v-card>
      </v-dialog>
      <v-navigation-drawer v-model="drawer" app clipped>
        <v-list dense>
          <v-list-item>
            <v-list-item-action>
              <v-icon>dashboard</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Menu</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action>
              <v-icon>fas fa-circle-notch fa-spin</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>v. beta 0.08 </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <template v-slot:append>
          <div class="pa-2">
            <v-btn color="blue darken-1" block @click="logout">Logout</v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>CMU DEVDAY WORKSHOP</v-toolbar-title>
      </v-app-bar>
      <v-content>
        <v-container v-if="tab1">
          <v-card class="mx-auto" max-width="100%" tile>
            <v-img
              height="100%"
              src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
            >
              <v-row align="end" class="fill-height">
                <v-col align-self="start" class="pa-0" cols="12">
                  <v-avatar class="profile" color="grey" size="164" tile>
                    <v-img :src="getPhoto()"></v-img>
                  </v-avatar>
                </v-col>
                <v-col class="py-0">
                  <v-list-item color="rgba(0, 0, 0, .4)" dark>
                    <v-list-item-content>
                      <v-list-item-title class="title"
                        >{{ lineprofile.displayName
                        }}{{ hrprofile.nameEng }}</v-list-item-title
                      >
                      <v-list-item-subtitle
                        >{{ lineprofile.statusMessage }}
                        {{ hrprofile.positionNameTha }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
              </v-row>
            </v-img>
          </v-card>
        </v-container>
      </v-content>
      <v-bottom-navigation app fixed grow color="primary">
        <v-btn @click="getLineProfile">
          <span>Line Profile</span>
          <v-icon>account_box</v-icon>
        </v-btn>

        <v-btn @click="getHRProfile">
          <span>HR Profile</span>
          <v-icon>history</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-app>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data: () => ({
    lineprofile: {
      userId: "",
      displayName: "",
      pictureUrl: "https://cdn.vuetifyjs.com/images/profiles/marcus.jpg",
      statusMessage: ""
    },
    hrprofile: {
      email: "",
      nameEng: "",
      positionNameTha: ""
    },
    drawer: null,
    dialog: false,
    tab1: true,
    tab2: false,
    tab3: false
  }),
  beforeCreate() {
    console.log("init");
    this.$liff.init(
      { liffId: "xxxxxxxxxxxxxxxx" },
      () => {
        if (this.$liff.isLoggedIn()) {
          console.log("isLoggedIn");
        } else {
          this.$liff.login();
        }
      },
      err => console.error(err.code)
    );
  },
  methods: {
    getPhoto() {
      return this.lineprofile.pictureUrl;
    },
    reset() {
      this.lineprofile.userId = "";
      this.lineprofile.displayName = "";
      this.lineprofile.statusMessage = "";
      this.hrprofile.email = "";
      this.hrprofile.nameEng = "";
      this.hrprofile.pictureUrl = "";
      this.hrprofile.positionNameTha = "";
    },
    getLineProfile() {
      this.reset();
      let _this = this;
      this.$liff
        .getProfile()
        .then(function(profile) {
          _this.lineprofile = profile;
          //_this.lineprofile.pictureUrl="\""+_this.lineprofile.pictureUrl+"\""
          //alert(_this.lineprofile.pictureUrl);
        })
        .catch(function(error) {
          alert("Error getting profile: " + error);
        });
    },
    getHRProfile() {

    },
    regisaccount(code) {

    },
    checkregis() {

    },
    logout() {
    
    }
  }
};
</script>
