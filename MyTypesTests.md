# Types Tests

## Testes de render

```jsx
import { render, screen } from '@testing-library/react';

import MyComponent from '.';

describe('Component: MyComponent', () => {
   // render do component
   it('renders correctly', () => {
      render(<MyComponent />);
      expect(render);
      screen.debug();
   });

   // pegar texto
   it('render text: Malting SWEEP', () => {
      render(<MyComponent />);
      const textElement = screen.getByText(/Malting SWEEP/i);
      expect(textElement).toBeInTheDocument();
   });

   // confere se existe um button
   it('there is button', () => {
      render(<MyComponent />);
      expect(screen.getByRole('button'));
   });

   // render text label
   it('render 1 input components', () => {
      render(<MyComponent />);
      const getByLabelText = screen.getByLabelText(/Barley Protein Range/i);
      expect(getByLabelText).toBeInTheDocument();
   });
});

```

## Testes de function
```jsx

```

## Testes de event
```jsx

```

## Testes de mock
```jsx

```

## Testes de mock/map
```jsx

```
