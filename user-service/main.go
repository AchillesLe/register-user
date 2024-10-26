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

func (s *UserServiceServer) CreateUser(ctx context.Context, req *pb.User) (*pb.User, error) {
	req.Id = uuid.New().String()
	s.users = append(s.users, req)
	return req, nil
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
			{Id: uuid.New().String(), Username: "sample_user1", Email: "sample1@example.com"},
			{Id: uuid.New().String(), Username: "sample_user2", Email: "sample2@example.com"},
		},
	}

	pb.RegisterUserServiceServer(grpcServer, userService)

	fmt.Println("User service is running on port :4001")
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve gRPC server: %v", err)
	}
}
