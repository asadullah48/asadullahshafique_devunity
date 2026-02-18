# Blog API Tests
# ===============
import pytest
from fastapi.testclient import TestClient


class TestBlogEndpoints:
    """Test blog post endpoints."""

    def test_get_all_blogs(self, client: TestClient):
        """Test retrieving all blog posts."""
        response = client.get("/api/blog")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) > 0

    def test_get_featured_blogs(self, client: TestClient):
        """Test retrieving featured blog posts."""
        response = client.get("/api/blog?featured=true")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        for post in data:
            assert post["featured"] is True

    def test_get_non_featured_blogs(self, client: TestClient):
        """Test retrieving non-featured blog posts."""
        response = client.get("/api/blog?featured=false")
        
        assert response.status_code == 200
        data = response.json()
        for post in data:
            assert post["featured"] is False

    def test_get_blog_with_limit(self, client: TestClient):
        """Test retrieving blog posts with limit."""
        response = client.get("/api/blog?limit=2")
        
        assert response.status_code == 200
        data = response.json()
        assert len(data) <= 2

    def test_get_single_blog_by_slug(self, client: TestClient):
        """Test retrieving a single blog post by slug."""
        # First get all blogs to find a valid slug
        all_blogs_response = client.get("/api/blog")
        all_blogs = all_blogs_response.json()
        valid_slug = all_blogs[0]["slug"]
        
        response = client.get(f"/api/blog/{valid_slug}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["slug"] == valid_slug
        assert "title" in data
        assert "excerpt" in data

    def test_get_nonexistent_blog(self, client: TestClient):
        """Test retrieving a non-existent blog post."""
        response = client.get("/api/blog/nonexistent-slug")
        
        assert response.status_code == 404


class TestBlogPostStructure:
    """Test blog post data structure."""

    def test_blog_post_fields(self, client: TestClient):
        """Test that blog posts have all required fields."""
        response = client.get("/api/blog")
        data = response.json()
        
        required_fields = ["id", "title", "excerpt", "date", "read_time", "tags", "slug", "featured"]
        
        for post in data:
            for field in required_fields:
                assert field in post, f"Missing field: {field}"

    def test_blog_post_tags_format(self, client: TestClient):
        """Test that tags are formatted correctly."""
        response = client.get("/api/blog")
        data = response.json()
        
        for post in data:
            assert isinstance(post["tags"], list)
            for tag in post["tags"]:
                assert isinstance(tag, str)

    def test_blog_post_date_format(self, client: TestClient):
        """Test that dates are formatted correctly."""
        response = client.get("/api/blog")
        data = response.json()
        
        for post in data:
            # Date should be in format like "Feb 2026"
            assert isinstance(post["date"], str)
            assert len(post["date"]) > 0
