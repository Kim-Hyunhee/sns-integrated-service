import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Feed {
  @PrimaryGeneratedColumn()
  feedId: number;

  @Column({ unique: true })
  contentId: string; // 게시물의 고유 식별자 (UUID)

  @Column()
  type: string; // 게시물 유형 (예: "text", "image", "video" 등)

  @Column()
  title: string; // 게시물 제목

  @Column('text')
  content: string; // 게시물 내용

  @Column('json', { nullable: true })
  hashtags: string[]; // 해시태그 (JSON 배열)

  @Column({ default: 0 })
  viewCount: number; // 조회수

  @Column({ default: 0 })
  likeCount: number; // 좋아요 수

  @Column({ default: 0 })
  shareCount: number; // 공유 수

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date; // 생성 일시

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date; // 수정 일시
}
