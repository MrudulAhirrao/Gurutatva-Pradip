import express from 'express';
import cors from 'cors';
import { userRouter } from '@/api/users/route';
import { connect } from '@/firebaseConfig/firebaseConfig';

const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());
app.use('/api/users', userRouter);

connect().catch(error => console.error('Error connecting to database:', error));

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});