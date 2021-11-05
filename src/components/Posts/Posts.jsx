import React, { useState, useEffect } from 'react';

const Posts = () => {
   //-------------------------------------------------------
   // Variaveis
   //-------------------------------------------------------
   const newPostDefaultValues = { title:'', body:''};
   const [posts, setPosts] = useState([]);
   const [newPost, setNewPost] = useState(newPostDefaultValues);
   // por padrão trazer o form oculto
   const [postFormIsVisible, setPostFormIsVisible] = useState(false);


   //-------------------------------------------------------
   // useEffect
   //-------------------------------------------------------
   useEffect(() => {
      fetch('https://jsonplaceholder.typicode.com/posts')
         .then(response => response.json())
         .then(data => setPosts(data));
   }, []);


   //-------------------------------------------------------
   // Functios do btn submit 
   //-------------------------------------------------------
   const handleOnSubmit = e => {
      e.preventDefault();
      //console.log('new post ', newPost);

      fetch('https://jsonplaceholder.typicode.com/posts',{
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         // stringify: converte obj js em uma sequência json
         body: JSON.stringify(newPost),
      })
      // analisa a resposta como json
      .then(response => response.json())
      // o metodo que terá os dados do novo post
      .then((data) => {
         // se der certo oculta o form, injeta o post e limpa os inputs
         setPostFormIsVisible(false);
         setNewPost(newPostDefaultValues);
         setPosts([...posts, data])
      })
   };

   
   //-------------------------------------------------------
   // Functios do btn cancel
   //-------------------------------------------------------
   const handleOnCancel = e => {
      // oculta form e limpa os inputs
      setPostFormIsVisible(false)
      setNewPost(newPostDefaultValues);
   };


   //-------------------------------------------------------
   // Return Form e List 
   //-------------------------------------------------------
   return (
      <div>
         {!postFormIsVisible && (
            <button type="button" onClick={() => setPostFormIsVisible(true)}>Add New Post</button>
         )}

         {postFormIsVisible && (
            <form onSubmit={handleOnSubmit}>
               <h3>New Post</h3>
               <input 
                  type="text" 
                  placeholder="Title" 
                  value={newPost.title}
                  onChange={(e) =>
                     setNewPost({...newPost, title: e.target.value})
                  } 
               />

               <br />

               <textarea 
                  placeholder="Body" 
                  value={newPost.body}
                  onChange={(e) =>
                     setNewPost({...newPost, body: e.target.value})
                  } 
               >
               </textarea>

               <br />

               <button type="submit">Submit</button>
               <button type="button" onClick={handleOnCancel}>Cancel</button>
            </form>
         )}

         <h1>Posts</h1>
         <ul>
            {posts.map((post, index) => (
               <li key={index}>
                  <h3>{post.title}</h3>
                  <p>{post.body}</p>
               </li>
            ))}
         </ul>
      </div>
   );
};

export default Posts;

// https://www.youtube.com/watch?v=Jew6yQUHSPI
