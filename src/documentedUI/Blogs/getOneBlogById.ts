export default {
    get:{
        tags:['Blogs'],
        description:'Get Single blog',
        operationId:'getSingleBlog',
        parameters:[
            {
                name:'id',
                in:'path',
                schema:{
                    type:'string',
                },
                required:true,
            },
        ],
        responses:{
            '200':{
                description:'Blog not found',
                content:{
                    'application/json':{
                        schema:{
                            $ref:'#/components/schemas/Blog',
                        },
                    },
                },
            },
            '404':{
                description:'Blog found',
            },
            '500':{
                description:'Internal server error',
            },
        },
    },
    }