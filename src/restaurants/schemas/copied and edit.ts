//
// // findById
// describe('findById', () => {
//   it('should get restaurant by Id', async () => {
//     jest
//       .spyOn(restaurantModel, 'findById')
//       .mockResolvedValueOnce(existingRestaurant as any);
//     const result = await restaurantsService.findRestaurantById(
//       existingRestaurant._id,
//     );
//     expect(result).toEqual(existingRestaurant);
//   });
//
//   // check the id
//   it('should throw wrong mongoose id', async () => {
//     await expect(
//       restaurantsService.findRestaurantById('wrong id'),
//     ).rejects.toThrow(BadRequestException);
//   });
//
//   it('should throw restaurant not found error', async () => {
//     const mockError = new NotFoundException('Restaurant not found');
//     jest.spyOn(restaurantModel, 'findById').mockRejectedValue(mockError);
//     await expect(
//       restaurantsService.findRestaurantById(existingRestaurant._id),
//     ).rejects.toThrow(NotFoundException);
//   });
// });
//
// // updateById
// describe('updateById', () => {
//   // check if id is valid
//   it('should throw wrong mongoose id', async () => {
//     await expect(
//       restaurantsService.findRestaurantById('wrong id'),
//     ).rejects.toThrow(BadRequestException);
//   });
//   // check if id exist
//   it('should throw restaurant not found error', async () => {
//     jest
//       .spyOn(restaurantModel, 'findById')
//       .mockRejectedValue(mockNotFoundExceptionError);
//     await expect(
//       restaurantsService.findRestaurantById(existingRestaurant._id),
//     ).rejects.toThrow(NotFoundException);
//   });
//   //update the restaurant
//   it('should update the restaurant', async () => {
//     //
//     const restaurant = { ...existingRestaurant, name: 'Blessed Restaurant' };
//     const updateRestaurant = { name: 'Updated Restaurant name' };
//     jest
//       .spyOn(restaurantModel, 'findByIdAndUpdate')
//       .mockResolvedValueOnce(updateRestaurant as any);
//     const updatedRestaurant = await restaurantsService.updateRestaurantById(
//       restaurant._id,
//       updateRestaurant as any,
//       mockNewCreatedUser as any,
//     );
//
//     expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
//   });
// });
//
// // deleteById
// describe('deleteById', () => {
//   it('should throw wrong mongoose id', async () => {
//     await expect(
//       restaurantsService.findRestaurantById('wrong id'),
//     ).rejects.toThrow(BadRequestException);
//   });
//
//   it('should throw restaurant not found error', async () => {
//     const mockError = new NotFoundException(
//       "The Restaurant you want to delete doesn't exit",
//     );
//     jest.spyOn(restaurantModel, 'findById').mockRejectedValue(mockError);
//     await expect(
//       restaurantsService.findRestaurantById(existingRestaurant._id),
//     ).rejects.toThrow(NotFoundException);
//   });
//
//   it('should delete a restaurant by its Id', async () => {
//     jest
//       .spyOn(restaurantModel, 'findByIdAndDelete')
//       .mockResolvedValueOnce(existingRestaurant as any);
//
//     const result = await restaurantsService.deleteRestaurantById(
//       existingRestaurant._id,
//     );
//     expect(result).toEqual(existingRestaurant);
//   });
// });
//
// // upload images
// describe('uploadImages', () => {
//   it('should upload images to S3 Bucket', async () => {
//     const mockImages = [
//       {
//         Etag: '"jkffdddfdffgggffdfddf"',
//         location:
//           'https://restaurant-api-bucket.s3.amazon.com/restaurant-images',
//         key: 'restaurant-image-1.png',
//         Key: 'restaurant-image-2.png',
//         Bucket: 'restaurant-bucket',
//       },
//     ];
//
//     const updatedRestaurant = { ...existingRestaurant, images: mockImages };
//
//     jest.spyOn(ApiFeatures, 'uploadImages').mockResolvedValue(mockImages);
//     jest
//       .spyOn(restaurantModel, 'findByIdAndUpdate')
//       .mockResolvedValueOnce(updatedRestaurant as any);
//
//     const file = [
//       {
//         fieldname: 'files',
//         originalname: 'README.md',
//         encoding: '7bit',
//         mimetype: 'text/markdown',
//         buffer:
//           '<Buffer 23 20 43 6f 64 69 6e 67 20 49 6e 74 65 72 76 69 65 77 20 55 6e 69 76 65 72 73 69 74 79 0a 0a 3e 20 49 20 6f 72 69 67 69 6e 61 6c 6c 79 20 63 72 65 61 ... 141789 more bytes>',
//         size: 141839,
//       },
//     ];
//
//     const result = await restaurantsService.uploadImage(
//       existingRestaurant._id,
//       file,
//     );
//     expect(result).toEqual(updatedRestaurant);
//   });
// });
//
// // delete images
// describe('deleteImages', () => {
//   it('should delete images from s3 bucket', async () => {
//     const mockImages = [
//       {
//         Etag: '"jkffdddfdffgggffdfddf"',
//         location:
//           'https://restaurant-api-bucket.s3.amazon.com/restaurant-images',
//         key: 'restaurant-image-1.png',
//         Key: 'restaurant-image-2.png',
//         Bucket: 'restaurant-bucket',
//       },
//     ];
//     jest.spyOn(ApiFeatures, 'deleteImages').mockResolvedValue(true);
//     const result = await restaurantsService.deleteImage(mockImages);
//     expect(result).toBe(true);
//   });
// });
//
// describe('deleteById', () => {
//   it('should throw wrong mongoose id', async () => {
//     await expect(
//       restaurantsService.findRestaurantById('wrong id'),
//     ).rejects.toThrow(BadRequestException);
//   });
//
//   it('should throw restaurant not found error', async () => {
//     const mockError = new NotFoundException(
//       "The Restaurant you want to delete doesn't exit",
//     );
//     jest
//       .spyOn(restaurantModel, 'findByIdAndDelete')
//       .mockRejectedValue(mockError);
//     await expect(
//       restaurantsService.findRestaurantById(existingRestaurant._id),
//     ).rejects.toThrow(NotFoundException);
//   });
// });