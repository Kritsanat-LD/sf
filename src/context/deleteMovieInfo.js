import { db } from '../firebase';
import { collection, deleteDoc , doc,  getDocs, query, updateDoc, where} from 'firebase/firestore';

const deleteMovieInfoDB = async (data) => {
    try{
        await deleteCommentOnMovieDelete(data)
        await deleteDoc(doc(db, "Movies", data));
        console.log('Movie info deleted from Firestore successfully');
    } catch (error){
        console.error('Error deleted movie info from Firestore:', error);
    }
  };

const deleteCommentOnMovieDelete = async (data) =>{
    try{
        const querySnapshot = await getDocs(query(collection(db,"comment"),where("movie_id","==",data)))
        querySnapshot.forEach(async (doc)=>{
            await deleteDoc(doc.ref);
        });
        console.log('Comment deleted successfully');
    }catch(error){
        console.error('Error deleting comment:', error);
    }
}

const deleteMovieGenreDB = async (data) =>{
    try {
        await changeMovieGenreInMovieTable(data)
        await deleteDoc(doc(db, "Movie Genre", data.id));
        console.log('Movie Genre deleted from Firestore successfully');
    }catch(error){
        console.error('Error deleting Genre:', error);
    }
}

const changeMovieGenreInMovieTable = async (genre) =>{
    const option = {
        label: 'ZZZ',
        value : 'opz2jtBSDFq6Qwme6X7Y'
    }
    try{
        const querySnapshot = await getDocs(query(collection(db,"Movies"),where("MovieGenres","array-contains",{ label: genre.MovieGenre , value: genre.id})))
        querySnapshot.forEach(async (doc) => {
            const movieRef = doc.ref;
      
            try {
              // Get the current MovieGenres array
              const currentGenres = doc.data().MovieGenres;
      
              // Find the index of the genre you want to change
              const indexToChange = currentGenres.findIndex(
                (e) => e.label === genre.MovieGenre && e.value === genre.id
              );
      
              if (indexToChange !== -1) {
                // Replace the genre at the found index with the new genre option
                currentGenres[indexToChange] = option;
      
                // Update the document with the modified MovieGenres array
                await updateDoc(movieRef, {
                  MovieGenres: currentGenres,
                });
      
                console.log('Update MovieGenre in that movie success');
              }
            } catch (error) {
              console.log('Update MovieGenre in that movie fail', error);
            }
          });
    }catch(error){
        console.error('Error Change Genre:', error);
    }
}

const deleteCommentDB = async (commentID) =>{
    try{
        await deleteDoc(doc(db, "comment", commentID));
        console.log('Comment deleted from Firestore successfully');
    }catch(error){
        console.error('Error deleted comment from Firestore:', error);
    }

}


export { deleteMovieInfoDB , deleteMovieGenreDB , deleteCommentDB};