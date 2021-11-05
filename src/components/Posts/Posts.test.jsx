import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
//import '@testing-library/jest-dom'; // não precisa importar novamente pq já está em SetupTests.js

import Posts from './Posts';


//-------------------------------------------------------
// Dados mock 
//-------------------------------------------------------
const mockPostsData = [
   {
      userId: 1,
      id: 1,
      title: "qui est esse 1",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
   },
   {
      userId: 1,
      id: 2,
      title: "qui est esse 2",
      body: "est rerum tempore vitae\nsequi sint nihil reprehenderit dolor beatae ea dolores neque\nfugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis\nqui aperiam non debitis possimus qui neque nisi nulla"
   },
   {
      userId: 1,
      id: 3,
      title: "qui est esse 3",
      body: "et iusto sed quo iure\nvoluptatem occaecati omnis eligendi aut ad\nvoluptatem doloribus vel accusantium quis pariatur\nmolestiae porro eius odio et labore et velit aut"
   }
];

const mockNewPostsData = {
   userId: 1,
   id: 8,
   title: "qui est esse mockNewPostsData",
   body: "et iusto quis pariatur\nmolestiae porro eius odio et labore et velit aut"
};

//-------------------------------------------------------
// Suite de testes
//-------------------------------------------------------
describe('Component: Posts', () => {
   //-------------------------------------------------------
   // Criando o Mock
   // antes de cada teste quero criar um mock para p metodo fetch
   //-------------------------------------------------------
   beforeEach(() => {
      // dentro desse retorno de chamada vai trazer por promise so o resolve
      global.fetch = jest.fn((url, options) => {
         if (options?.method === 'POST') {
            return Promise.resolve({
               json: () => Promise.resolve(mockNewPostsData),
            });
         } else {
            return Promise.resolve({
               json: () => Promise.resolve(mockPostsData),
            })
         }
      });
   });


   //-------------------------------------------------------
   // Teste 1: Render component
   //
   // neste caso temos q envolver nosso component no método act,
   // pq temos atualização de estado junto com o codígo assíncrono
   //-------------------------------------------------------
   it('renders correctly', async () => {
      await act(async () => render(<Posts />));
      screen.debug();
   });


   //-------------------------------------------------------
   // Teste 2: Render text
   //
   // obs. metodo getByText precias do import '@testing-library/jest-dom';
   //-------------------------------------------------------
   it('render text: qui est esse 1', async () => {
      await act(async () => render(<Posts />));
      expect(screen.getByText(/qui est esse 1/i)).toBeInTheDocument();
   });


   //-------------------------------------------------------
   // Teste 3: Render text com forEach
   //
   // forEach vai pegar cada title dentro do component
   //-------------------------------------------------------
   it('render text forEach', async () => {
      await act(async () => render(<Posts />));
      mockPostsData.forEach(post =>
         expect(screen.getByText(post.title)).toBeInTheDocument()
      );
   });


   //-------------------------------------------------------
   // Teste 4: Eventos de botão
   //
   // outra forma de redenrizar o component com waitFor
   //-------------------------------------------------------
   it('clique em cancelar deve ocultar o formulário', async () => {
      render(<Posts />);

      // btn Add New Post
      // quando clicar em Add New Post, espero encontrar o input com placeholder Title
      await waitFor(() => fireEvent.click(screen.getByText('Add New Post')))
      expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();

      // mudança de evento
      // verificar o valor do campo de entrada quando clica em cancelar
      fireEvent.change(screen.getByPlaceholderText('Title'), {
         target: {value: 'New Post Title'},
      })
      expect(screen.queryByPlaceholderText('Title').value).toBe('New Post Title');

      // o btn Cancel deve estar visivel ao clicar no btn Add New Post
      // quando clicar em cancel, espero não encontrar o input com placeholder Title
      // nesse cado usamos query no lugar de get e adicionamos o .not antes do toBeInTheDocument()
      fireEvent.click(screen.getByText('Cancel'))
      expect(screen.queryByPlaceholderText('Title')).not.toBeInTheDocument();

      // click no botão e add nova postagem, espero ter o valor do campo vazio e espero uma string vazia
      fireEvent.click(screen.getByText('Add New Post'));
      expect(screen.queryByPlaceholderText('Title').value).toBe('');
   });

   
   //-------------------------------------------------------
   // Teste 5: Eventos de botão
   //
   // outra forma de redenrizar o component com waitFor
   //-------------------------------------------------------
   it('verifica se o usuário e capaz de criar novo post e envio do form e renderização de um novo post', async () =>{
      render(<Posts />);

      // abre o form
      await waitFor(() => fireEvent.click(screen.getByText('Add New Post')));

      // var para reutilizar
      const titleInpuEl = screen.getByPlaceholderText('Title');
      const bodyTextareaEl = screen.getByPlaceholderText('Body');
      const submitBtnEl = screen.getByRole('button', { name: 'Submit'});

      // expero com clicar em Add New Post o value do input titulo vazio
      expect(titleInpuEl.value).toBe('');
      expect(bodyTextareaEl.value).toBe('');
      expect(submitBtnEl).toBeInTheDocument();

      // Digitação
      // evento de mudança no input title
      fireEvent.change(titleInpuEl, { target: { value: mockNewPostsData.title}});
      fireEvent.change(bodyTextareaEl, { target: { value: mockNewPostsData.body}});

      // add evento no submit
      await waitFor(() => fireEvent.click(submitBtnEl));

      // verificar se o form está oculto depois do submit 
      expect(titleInpuEl).not.toBeInTheDocument();
      expect(bodyTextareaEl).not.toBeInTheDocument();

      // verificar se a nova postagem está sendo exibida na tela
      expect(screen.getByText(mockNewPostsData.title)).toBeInTheDocument();
      expect(screen.getByText(/et iusto quis pariatur/i)).toBeInTheDocument();
   });

   
   //-------------------------------------------------------
   // Teste 6: Metodo fetch
   //
   //-------------------------------------------------------
   it('testar se o metodo fetch está sendo chamado quando o component é renderizado', async () =>{
      render(<Posts />);

      expect(window.fetch).toHaveBeenCalledWith(
         'https://jsonplaceholder.typicode.com/posts'
      )

      // abre o form
      await waitFor(() => fireEvent.click(screen.getByText('Add New Post')));
   });
});
