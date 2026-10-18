<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" version="1.0">
    <xsl:output method="xml" omit-xml-declaration="yes"/>
    <xsl:template match="/">
        <figure class="ck-video">
            <video class="ck-video__media" controls="controls" playsinline="playsinline">
                <xsl:if test="/*/@alt">
                    <xsl:attribute name="aria-label"><xsl:value-of select="/*/@alt"/></xsl:attribute>
                </xsl:if>
            </video>
            <xsl:if test="/*/@legend">
                <figcaption class="ck-video__legend"><xsl:value-of select="/*/@legend"/></figcaption>
            </xsl:if>
        </figure>
    </xsl:template>
</xsl:stylesheet>
