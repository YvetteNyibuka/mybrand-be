import Joi, { Schema } from 'joi';

const blogSchema: Schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const validateBlog = (blogData: Record<string, any>) => {
  return blogSchema.validate(blogData);
};

export default validateBlog;