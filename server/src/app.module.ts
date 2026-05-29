import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

@Module({
  // Importa el módulo y disponibiliza en este módulo TODO LO QUE EL MODULO IMPORTADO EXPORTA
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!), 
    UsersModule],
  controllers: [AppController ],
  providers: [AppService],
})
export class AppModule {}
