# 📦 Gexii

A powerful React-based library designed to simplify UI development with Material-UI and React Hook Form.

## 🚀 Features

- 📢 **Dialogs** - A powerful React hook for efficiently managing MUI dialogs.
- 📝 **Fields** - A flexible form component inspired by Ant Design Form, supporting React Hook Form and validation with Zod/Yup.
- 🔍 **Query-Fields** - An enhanced version of `Fields` that syncs with URL search parameters for seamless state management.
- 📊 **Table** - A high-level table component built on MUI Table, offering a cleaner and more developer-friendly experience.
- 🏗️ **Hooks** - A collection of custom hooks designed to streamline React development.
- 🔧 **Utils** - Essential utility functions for React applications.
- 🎨 **Theme** - Styling utilities based on MUI's styled system.
- 📦 **UI** - Reusable UI components for general use.

## 📖 Installation

Install via npm:

```sh
npm install gexii
```

Or with yarn:

```sh
yarn add gexii
```

## 🛠 Usage

### 📢 Dialogs

Gexii provides a powerful `useDialogs` hook for managing modals and confirmations effortlessly.

```js
import { useDialogs } from 'gexii/dialogs';

const dialogs = useDialogs();

// Alert Dialog
dialogs.alert('Title', 'Message');

// Confirmation Dialog
const answer = await dialogs.confirm('Title', 'Message');
```

### 📝 Fields

Gexii simplifies form handling with its `Fields` component, designed to work seamlessly with React Hook Form.

```js
import { Field, Form } from 'gexii/fields';
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const methods = useForm();
  
  return (
    <Form methods={methods}>
      <Field name="username">
        <input />
      </Field>
    </Form>
  );
};
```

### 🔍 Query-Fields

`QueryField` integrates with URL search parameters, making it easy to manage filters and state persistence.

```js
import { QueryField } from 'gexii/query-fields';

const MyComponent = () => (
  <QueryField.Provider>
    <QueryField query="username">
      <input />
    </QueryField>
  </QueryField.Provider>
);
```

### 📊 Table

The `Table` component provides a structured way to display data with MUI styling.

```js
import { Table, Cell } from 'gexii/table';

const MyComponent = () => (
  <Table source={[{ title: "Title Example", description: "Description Example" }]}>
    <Cell path="title" label="Title" />
    <Cell path="description" label="Description" />
  </Table>
);
```

## 🏗️ Contributing

We welcome contributions! To get started:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/feature-name`).
3. Make your changes and commit (`git commit -m 'feat: Add feature'`).
4. Push to your branch (`git push origin feature/feature-name`).
5. Open a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙌 Acknowledgments

Special thanks to all contributors and inspirations behind this project.

