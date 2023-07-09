// // import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
// import { DenunciationService } from './denunciation.service';
// import { PaginationDto } from 'src/common/dtos/pagination.dto';


// @WebSocketGateway()
// export class DenuciationGateway {
//   constructor(private readonly denuciationService: DenunciationService) {}

//   @SubscribeMessage('findAllDenuciationWs')
//   findAll(@MessageBody() paginationDto: PaginationDto, id: number) {
//     return this.denuciationService.findAllByType(paginationDto, id);
//   }

//   @SubscribeMessage('findOneDenuciationW')
//   findOne(@MessageBody() id: number) {
//     return this.denuciationService.findOne(id);
//   }
// }
