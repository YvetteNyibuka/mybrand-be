export default {
    patch: {
        tags:["Blogs"],
        description:"Update blog",
        operationId:"updateBlog",
        security:[
            {
                BearerAuth:[]
            }
        ],
        parameters:[
            {
                name:"id",
                in:"path",
                schema:{
                    type:"string"
                },
                required:true
            }
        ],
        requestBody:{
            required:true,
            content:{
                "multipart/form-data":{
                    schema:{
                        type:"object",
                        properties:{
                            title:{type:"string", example:"ATLP journey"},
                            description:{type:"string", example:"blog description"},
                            coverImage:{type:"string", format:"binary"}
                        },
                        required:["title", "description", "coverImage"]
                    }
                }
            }
        },
        responses:{
            "201":{
                description:"Blog was updated",
                content:{
                    "application/json":{
                        schema:{
                            $ref:"#components/schemas/Blog"
                        }
                    }
                }
            },
            "400":{
                description:"Blog not found",
                content:{
                    "application/json":{
                        example:{
                            status:false,
                            message:"Please fill all required fields"
                        }
                    }
                }
            },
            "500":{
                description:"Internal server error",
                   
                }
            }
        }
    }

