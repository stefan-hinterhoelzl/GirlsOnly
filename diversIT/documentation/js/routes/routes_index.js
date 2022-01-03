var ROUTES_INDEX = {"name":"<root>","kind":"module","className":"AppModule","children":[{"name":"routes","filename":"src/app/app-routing.module.ts","module":"AppRoutingModule","children":[{"path":"","pathMatch":"full","redirectTo":"app"},{"path":"landing","component":"LandingPageComponent"},{"path":"forum","component":"ForumComponent"},{"path":"forum/:id","component":"ForumThreadComponent"},{"path":"impressum","component":"ImprintComponent"},{"path":"datenschutz","component":"PrivacyComponent"},{"path":"app","component":"MainComponent","canActivate":["AuthguardService","MentorGuardService"]},{"path":"admin","component":"AdminPageComponent","canActivate":["AuthguardService","AdminguardService"]},{"path":"chat","component":"ChatComponent","canActivate":["AuthguardService"]},{"path":"unauthorized","component":"UnauthorizedComponent","canActivate":["AuthguardService"]},{"path":"profile/:id","component":"ProfilePageComponent","canActivate":["AuthguardService"]},{"path":"profilesettings","component":"ProfileSettingsComponent","canActivate":["AuthguardService"]},{"path":"notifications","component":"NotificationsComponent","canActivate":["AuthguardService"]},{"path":"relations","component":"RelationsPageComponent","canActivate":["AuthguardService"]}],"kind":"module"}]}
