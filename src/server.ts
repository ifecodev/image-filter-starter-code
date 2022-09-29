import express, {Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage", async (req: Request, res: Response) => {
    const image_url: string = req.query.image_url;

    //Check if image_url is valid
    if(!image_url) {
      return res.status(400).send("Image url is required");
    }

    //Get  Filtered Image
    const filteredpath: string = await filterImageFromURL(image_url).then((file) => {
      return file;

    }, (err) => {
        return null;
    });

    //Check if the path is valid
    if(!filteredpath){
      return res.status(422).send("File url is invalid");
    }

      //Delete all files on finish of the response
    res.on('finish', function() {
      const file_paths: Array<string> = [filteredpath]; 
      deleteLocalFiles(file_paths);
  });
    
    //Send filtered image to client
    return res.status(200).sendFile(filteredpath);
  })
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();