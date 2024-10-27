package main

import (
	"context"
	"fmt"
	"log"
	"net"

	// "github.com/google/uuid"
	pb "github.com/AchillesLe/register-user/user-service/gen-proto"
	"github.com/google/uuid"
	"google.golang.org/grpc"
)

type UserServiceServer struct {
	pb.UnimplementedUserServiceServer
	users []*pb.User
}

func (s *UserServiceServer) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.User, error) {
	newUser := &pb.User{
		Id:       uuid.New().String(),
		Username: req.GetUsername(),
		Email:    req.GetEmail(),
		Phone:    req.GetPhone(),
	}

	s.users = append(s.users, newUser)
	return newUser, nil
}

func (s *UserServiceServer) GetUsers(ctx context.Context, empty *pb.Empty) (*pb.Users, error) {
	return &pb.Users{Users: s.users}, nil
}

func main() {
	listener, err := net.Listen("tcp", ":4001")
	if err != nil {
		log.Fatalf("Failed to listen on port 4001: %v", err)
	}

	grpcServer := grpc.NewServer()
	userService := &UserServiceServer{
		users: []*pb.User{
			{Id: uuid.New().String(), Username: "sample_user1", Email: "sample1@example.com", Phone: "01266623200"},
			{Id: uuid.New().String(), Username: "sample_user2", Email: "sample2@example.com", Phone: "01277723200"},
		},
	}

	pb.RegisterUserServiceServer(grpcServer, userService)

	fmt.Println("User service is running on port :4001")
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve gRPC server: %v", err)
	}
}
