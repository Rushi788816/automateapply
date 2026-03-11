import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { OrgsModule } from "./orgs/orgs.module";
import { ResumesModule } from "./resumes/resumes.module";
import { SkillsModule } from "./skills/skills.module";
import { JobsModule } from "./jobs/jobs.module";
import { MatchesModule } from "./matches/matches.module";
import { ApprovalsModule } from "./approvals/approvals.module";
import { DatabaseService } from "./common/database.service";
import { ApplicationsModule } from "./applications/applications.module";
import { UsersModule } from "./users/users.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { SettingsModule } from "./settings/settings.module";
import { ConnectorsModule } from "./connectors/connectors.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OrgsModule,
    ResumesModule,
    SkillsModule,
    JobsModule,
    MatchesModule,
    ApprovalsModule,
    ApplicationsModule,
    UsersModule,
    NotificationsModule,
    SettingsModule,
    ConnectorsModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
