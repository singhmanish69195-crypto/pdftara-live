{ config, lib, pkgs, ... }:

let
  cfg = config.services.pdftara;
in
{
  options.services.pdftara = {
    enable = lib.mkEnableOption "PDFTara - Professional PDF Tools";

    package = lib.mkOption {
      type = lib.types.package;
      default = pkgs.pdftara;
      defaultText = lib.literalExpression "pkgs.pdftara";
      description = "The PDFTara package to use.";
    };

    port = lib.mkOption {
      type = lib.types.port;
      default = 3000;
      description = "Port to listen on.";
    };
  };

  config = lib.mkIf cfg.enable {
    nixpkgs.overlays = [
      (final: prev: {
        pdftara = final.callPackage ./package.nix { };
      })
    ];

    systemd.user.services.pdftara = {
      Unit = {
        Description = "PDFTara PDF Tools";
        After = [ "network.target" ];
      };

      Service = {
        ExecStart = "${cfg.package}/bin/pdftara";
        Restart = "on-failure";
        Environment = [
          "PDFTARA_PORT=${toString cfg.port}"
        ];
      };

      Install = {
        WantedBy = [ "default.target" ];
      };
    };
  };
}
