import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, doc, getDoc, orderBy } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebase';
import { deleteCommentDB } from '../context/deleteMovieInfo';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminManagementCss from "../css/adminmanagement.module.css"
import NavbarAdmin from './navbaradmin';

const Comment = () => {
  const [commentsWithNames, setCommentsWithNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(''); // State to store the selected movie name
  const [movieNames, setMovieNames] = useState([]); // State to store the list of movie names



  useEffect(() => {
    const fetchComments = async () => {
      try {

        const commentsQuery = collection(db, 'comment');
        const commentsSnapshot = await getDocs(query(commentsQuery));
        const commentsData = [];
        const movieNamesData = [];

        for (const commentDoc of commentsSnapshot.docs) {
          const comment = commentDoc.data();
          const userId = comment.user_id;
          const MovieId = comment.movie_id;

          // Fetch the user's name based on user_id
          const userDocRef = doc(db, 'user', userId);
          const userDocSnapshot = await getDoc(userDocRef);
          const user = userDocSnapshot.data();

          // Fetch the user's name based on movie_id
          const movieDocRef = doc(db, 'Movies', MovieId);
          const movieDocSnapshot = await getDoc(movieDocRef);
          const movie = movieDocSnapshot.data();
          movieNamesData.push(movie.MovieName)

          if (user) {
            commentsData.push({
              id: commentDoc.id,
              comment: comment.comment,
              userName: user.name,
              movieName: movie.MovieName,
              time: comment.commentDate,
            });
          }
        }
        setCommentsWithNames(commentsData);
        const uniqueMovieNames = new Set(movieNamesData);
        setMovieNames(Array.from(uniqueMovieNames));
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setIsLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleDeleteComment = async (commentID) => {
    return toast.promise(
      async (resolve) => {
        try {
          await deleteCommentDB(commentID);
          console.log('Comment deleted successfully');
        } catch (error) {
          console.error('Error deleting comment:', error);
        }
      },
      {
        pending: 'Deleting comment, please wait...',
        success: 'Comment deleted successfully!',
        error: 'Error deleting comment. Please try again later.',
      }
    ).then(() => {
      // Filter out the deleted actor from the state
      setCommentsWithNames((prevComment) => prevComment.filter((comment) => comment.id !== commentID));
    });
  };
  // Filter comments based on the selected movie
  const filteredComments = commentsWithNames.filter((comment) => {
    return selectedMovie === '' || comment.movieName === selectedMovie;
  });

  return (
    <>
      <NavbarAdmin />




      <div className={AdminManagementCss.container}>


        <h1>Comment Management</h1>
        <label>Select a Movie: </label>
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
        >
          <option value="">All Movies</option>
          {movieNames.map((movieName) => (
            <option key={movieName} value={movieName}>
              {movieName}
            </option>
          ))}
        </select>
        <ul>
          {isLoading ? (
            <span className={AdminManagementCss.loader}></span>
          ) : (
            <>
              <div className={AdminManagementCss.warpper_comment}>
                {filteredComments.map((e, index) => (
                  <div key={index} className={AdminManagementCss.bordercomment}>
                    <p><strong>User Name:</strong>  {e.userName}</p>
                    <p><strong>Movie:</strong>      {e.movieName}</p>
                    <p><strong>Comment:</strong>    {e.comment}</p>
                    <p><strong>Time :</strong>      {e.time}</p>
                    <button className={AdminManagementCss.contentbtndelete1} onClick={() => handleDeleteComment(e.id)}><FontAwesomeIcon icon={faTrash} /></button>
                    <br />
                    <br />
                  </div>
                ))}
              </div>
            </>
          )}
        </ul>
        <ToastContainer
                            position="top-center"
                            autoClose={2500}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss={false}
                            draggable
                            pauseOnHover={false}
                            theme="light"
                            />


      </div>
    </>
  );
}

export default Comment;