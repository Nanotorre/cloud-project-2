import express from 'express';
import { Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles, validateUrl} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get( "/filteredimage", async (req: Request, res: Response) => {
    
    try {
      let { image_url } = req.query;
      image_url = String(image_url);
      if (!validateUrl(image_url)) {
        return res.status(400).send(`Url is invalid`);
      }

      const imageFiltered = await filterImageFromURL(image_url);
      res.sendFile(imageFiltered);
      setTimeout(async () => {
        await deleteLocalFiles([imageFiltered]);
      }, 2000);
      return;
    } catch (error) {
      return res.status(500).send(`Internal error`);
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();